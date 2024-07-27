const express = require("express");
const multer = require("multer");
const Razorpay = require("razorpay");
const fs = require("fs");
const { PythonShell } = require("python-shell");
const app = express();
const upload = multer({ dest: "uploads/" }); // set the destination for uploaded files
const cors = require("cors");
const crypto = require("crypto");

app.use(cors());
// Allow only "http://localhost:5173" origin
// app.use(cors({ origin: "https://0414-49-36-103-50.ngrok-free.app" }));
app.use(express.json({ limit: "50mb" })); // Remove header from base64 image

const generateRazorpaySignature = (order_id, payment_id, secret) => {
  const signaturePayload = `${order_id}|${payment_id}`;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(signaturePayload);
  const generatedSignature = hmac.digest("hex");
  return generatedSignature;
};

app.post("/process-image", upload.single("image"), (req, res) => {
  // Convert base64 image to a file
  const base64Image = req.body.image; // Access the base64 string from req.body
  const path = `uploads/image.png`; // You may want to generate a unique name for each image

  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  fs.writeFile(path, base64Image, "base64", (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Set the options for PythonShell
    let options = {
      pythonPath:
        "C:/Users/Rylen/AppData/Local/Programs/Python/Python311/python.exe",
      pythonOptions: ["-u"],
      scriptPath:
        "C:\\Users\\Rylen\\Desktop\\Projects\\EventHorizon\\server_event_horizon", // Path to the directory containing your Python script
      args: [path],
    };

    let data = {};
    // Run Python script
    PythonShell.run("sfit_id_updated.py", options)
      .then((messages) => {
        // results is an array consisting of messages collected during execution
        Object.assign(
          data,
          JSON.parse(messages[2]),
          JSON.parse(messages[3]),
          JSON.parse(messages[4])
        );
        const image = fs.readFileSync("profile-pic.jpg");
        const imageBase64 = Buffer.from(image).toString("base64");
        data.image = imageBase64;
        res.json(data); // send the data as the response
      })
      .catch((err) => {
        res.status(500).json({ error: err.message }); // send any errors
      });
  });
});

app.post("/order", async (req, res, next) => {
  try {
    const data = req.body;
    if (data) {
      console.log(data);
    }

    const instance = new Razorpay({
      key_id: "rzp_test_NqTeCveAfsxaRq", // Use process.env to access environment variables
      key_secret: "9ViGtbPAN1xzqyUm1hwSunJG", // Use process.env to access environment variables
    });

    const options = {
      amount: data.amount,
      currency: data.currency,
    };

    instance.orders.create(options, (err, order) => {
      if (err) {
        console.error("Razorpay Error:", err);
        res.status(500).json({ error: err });
      } else {
        console.log("Razorpay Order:", order);
        res.status(200).send(order);
      }
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

app.post("/confirm-payment", (req, res) => {
  try {
    const { order_id, payment_id } = req.body;

    const generatedSignature = generateRazorpaySignature(
      order_id,
      payment_id,
      "9ViGtbPAN1xzqyUm1hwSunJG"
    );

    const razorpay_signature = req.body.razorpay_signature;

    if (generatedSignature === razorpay_signature) {
      res.status(200).send("success");
    } else {
      res.status(400).send("failed");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
