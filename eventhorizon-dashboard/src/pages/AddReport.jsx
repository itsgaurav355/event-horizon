import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Card,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, fireDB } from "../firebase/firebaseConfig";

const useStyles = makeStyles((theme) => ({
  all: {
    padding: 20,
  },
  formControl: {
    marginBottom: 20,
    minWidth: "100%",
  },
  text: {
    marginBottom: 20,
    minWidth: "100%",
  },
  // imagePreview: {
  //   maxWidth: 200,
  //   marginBottom: 20,
  // },
  imageContainer: {
    display: "flex",
    overflowX: "auto",
    overflowY:"auto",
    marginBottom: 2,
  },
  imagePreview: {
    maxWidth: 250,
    maxHeight:200,
    flex: "0 0 auto",
    marginRight: 2,
  },
}));

const AddReport = () => {
  const classes = useStyles();
  const [eventNames, setEventNames] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [reportData, setReportData] = useState({
    registeredUsers: "",
    attendees: "",
    absents: "",
    description: "",
    expenditure: "",
    earning: "",
    college:"St.Francis Insitute of Technology",
    entryFee: "",
    imageUrls: [],
    eventId: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEventNames = async () => {
      try {
        const eventCollection = collection(fireDB, "events");
        const snapshot = await getDocs(eventCollection);
        const eventNamesArray = snapshot.docs.map(
          (doc) => doc.data().event_name
        );
        setEventNames(eventNamesArray);
      } catch (error) {
        console.error("Error fetching event names:", error);
      }
    };

    fetchEventNames();
  }, []);

  const handleImageChange = (e) => {
    const files = e.target.files;
    setImages(files);
    const previews = [];
    for (let i = 0; i < files.length; i++) {
      previews.push(URL.createObjectURL(files[i]));
    }
    setImagePreviews(previews);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventStorageRef = ref(storage); // Reference to the root of storage
      const eventFolderRef = ref(eventStorageRef, `reports/${selectedEvent}`); // Reference to the folder for the selected event
      const imageUrls = [];

      for (let i = 0; i < images.length; i++) {
        const imageRef = ref(eventFolderRef, images[i].name); // Reference to the image in the event folder
        await uploadBytes(imageRef, images[i]);
        const url = await getDownloadURL(imageRef); // Get the download URL for the uploaded image
        imageUrls.push(url);
      }

      const selectedEventObject = eventNames.find(event => event === selectedEvent);
      const eventId = selectedEventObject ? selectedEventObject.id : "";
      
      const eventData = {
        event: selectedEvent,
        eventId: eventId,
        ...reportData,
        imageUrls: imageUrls,
      };

      const docRef = await addDoc(collection(fireDB, "reports"), eventData);
      setReportData({
        registeredUsers: "",
        attendees: "",
        absents: "",
        
        description: "",
        expenditure: "",
        earning: "",
        entryFee: "",
        imageUrls: [],
        eventId: ""
      });
      setImages([]);
      setImagePreviews([]);
      setSelectedEvent("");
      setLoading(false);
      console.log("Report added with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding report:", error);
      setLoading(false);
    }
  };
  
  return (
    <div className={classes.all}>
      <Typography variant="h5" gutterBottom>
        Add Event Report
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl
          className={classes.formControl}
          sx={{ mb: 0.6, minWidth: "100%" }}
        >
          <InputLabel id="event-label">Event Name</InputLabel>
          <Select
            labelId="event-label"
            id="event"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            required
          >
            {eventNames.map((eventName, index) => (
              <MenuItem key={index} value={eventName}>
                {eventName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
       <div className={classes.imageContainer}>
        {imagePreviews.map((preview, index) => (
          <Card key={index} variant="outlined" className={classes.imagePreview}>
            <CardMedia component="img" image={preview} />
          </Card>
        ))}
      </div>
        <TextField
          sx={{ mb: 1, minWidth: "100%" }}
          className={classes.text}
          label="Registered Users"
          name="registeredUsers"
          value={reportData.registeredUsers}
          onChange={handleInputChange}
          required
        />
        <TextField
          sx={{ mb: 1, minWidth: "100%" }}
          className={classes.text}
          label="Attendees"
          name="attendees"
          type="number"
          value={reportData.attendees}
          onChange={handleInputChange}
          required
        />
        <TextField
          sx={{ mb: 1, minWidth: "100%" }}
          className={classes.text}
          label="Absents"
          name="absents"
          type="number"
          value={reportData.absents}
          onChange={handleInputChange}
          required
        />
        <TextField
          sx={{ mb: 1, minWidth: "100%" }}
          className={classes.text}
          label="Description"
          name="description"
          multiline
          rows={4}
          value={reportData.description}
          onChange={handleInputChange}
          required
        />
        <TextField
          sx={{ mb: 1, minWidth: "100%" }}
          className={classes.text}
          label="Expenditure in Rs."
          name="expenditure"
          type="number"
          value={reportData.expenditure}
          onChange={handleInputChange}
          required
        />
        <TextField
          sx={{ mb: 1, minWidth: "100%" }}
          className={classes.text}
          label="Earning in Rs."
          name="earning"
          type="number"
          value={reportData.earning}
          onChange={handleInputChange}
          required
        />
        <TextField
          sx={{ mb: 1, minWidth: "100%" }}
          className={classes.text}
          label="Entry Fee in Rs."
          name="entryFee"
          type="number"
          value={reportData.entryFee}
          onChange={handleInputChange}
          required
        />
        {
        loading &&
         <CircularProgress sx={{ display: "block",
            margin: "auto",
            marginTop: 2, // Adjust as needed
            width: "50%", }} />}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            display: "block",
            margin: "auto",
            marginTop: 2, // Adjust as needed
            width: "50%", // Adjust width as needed
          }}
          disabled={loading}
        >
          {loading ? "Uploading Report..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default AddReport;
