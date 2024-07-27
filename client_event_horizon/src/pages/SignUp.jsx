import { useContext, useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import LoadingButton from "@mui/lab/LoadingButton";
import Image from "mui-image";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Avatar, InputAdornment } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Typography from "@mui/material/Typography";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import Container from "@mui/material/Container";
import { useLocation, useNavigate } from "react-router-dom";
import { signUpContext } from "../context/SignUpContext";
import { Outlet } from "react-router-dom";
import id_scan from "../assets/id_scan.jpg";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { auth, fireDB } from "../firebase/firbaseConfig";
import { updateProfile } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import NumbersRoundedIcon from "@mui/icons-material/NumbersRounded";
import { useFormik } from "formik";
import * as yup from "yup";
import { api } from "../../services/api";

export default function SignUp() {
  const { stepCount, setStepCount, setResponseData } =
    useContext(signUpContext);
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/signup":
        setStepCount(1);
        setResponseData("");
        break;
      case "/signup/2":
        setStepCount(2);
        break;
      case "/signup/3":
        setStepCount(3);
        break;
      default:
        setStepCount(0);
    }
  }, [location, setStepCount]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6">Step {stepCount} of 3</Typography>
        <Outlet />
      </Box>
    </Container>
  );
}

export const ScanIdCard = () => {
  const { setResponseData } = useContext(signUpContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(location.pathname); // log the current path

    if (!["/signup", "/signup/2", "/signup/3"].includes(location.pathname)) {
      setResponseData("");
      console.log("responseData cleared"); // log when responseData is cleared
    }
  }, [location]);

  const takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });

    // Send the base64 image to the server
    axios
      .post(`${api}/process-image`, {
        image: image.base64String,
      })
      .then((response) => {
        setResponseData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    navigate("/signup/2");
  };

  return (
    <>
      <Box>
        <Typography variant="h5" align="left" fontWeight={800} my={2} mb={2}>
          Scan your SFIT ID to autofill your personal details
        </Typography>
        <Image src={id_scan} duration={0} sx={{ borderRadius: 2 }} />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => takePicture()}
        >
          Use Camera
        </Button>
      </Box>
    </>
  );
};

export const ConfirmDetails = () => {
  const { responseData, setResponseData } = useContext(signUpContext);
  const navigate = useNavigate();

  if (!responseData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box>
        <Typography
          variant="h6"
          fontWeight={600}
          color="initial"
          mt={1}
          align="center"
        >
          Is this Information correct?
        </Typography>
        <Typography
          fontSize={15}
          align="center"
          fontWeight={100}
          color="initial"
          my={1}
        >
          We autofilled this info from your ID scan. Please confirm it's
          accurate
        </Typography>
        <Box display="flex" alignItems="start" flexDirection="column">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <Avatar
              src={`data:image/jpeg;base64,${responseData.image}`}
              sx={{ width: 100, height: 100, m: 2 }}
              imgProps={{ style: { objectFit: "cover" } }}
            />
          </Box>
          <Box display="flex" alignItems="center" p={2} gap={2}>
            <Box
              bgcolor="primary.light"
              display="flex"
              alignItems="center"
              borderRadius={1}
              p={2}
            >
              <PersonOutlineOutlinedIcon />
            </Box>
            <Box display="flex" flexDirection="column">
              <Typography variant="h6" color="initial">
                {responseData.name}
              </Typography>
              <Typography variant="subtitle2" color="primary">
                Full name
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" p={2} gap={2}>
            <Box
              bgcolor="primary.light"
              display="flex"
              alignItems="center"
              borderRadius={1}
              p={2}
            >
              <SchoolRoundedIcon />
            </Box>
            <Box display="flex" flexDirection="column">
              <Typography variant="h6" color="initial">
                {responseData.department}
              </Typography>
              <Typography variant="subtitle2" color="primary">
                Department
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" p={2} gap={2}>
            <Box
              bgcolor="primary.light"
              display="flex"
              alignItems="center"
              borderRadius={1}
              p={2}
            >
              <NumbersRoundedIcon />
            </Box>
            <Box display="flex" flexDirection="column">
              <Typography variant="h6" color="initial">
                {responseData.pid}
              </Typography>
              <Typography variant="subtitle2" color="primary">
                PID
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={2}
          width="100%"
        >
          <Button
            variant="outlined"
            sx={{ my: 2 }}
            onClick={() => {
              setResponseData("");
              navigate(-1);
            }}
          >
            Rescan
          </Button>
          <Button
            variant="contained"
            sx={{ my: 2 }}
            onClick={() => {
              navigate("/signup/3");
            }}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </>
  );
};

export const SignUpForm = () => {
  const { setResponseData, responseData } = useContext(signUpContext);
  const [user, loading] = useAuthState(auth);

  const [createUserWithEmailAndPassword, error] =
    useCreateUserWithEmailAndPassword(auth);

  const validationSchema = yup.object({
    email: yup
      .string("Enter your email")
      .email("Enter a valid email")
      .required("Email is required"),
    password: yup
      .string("Enter your password")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      createUserWithEmailAndPassword(values.email, values.password);
    },
  });

  const navigate = useNavigate();

  if (user) {
    updateProfile(user, {
      displayName: responseData.name,
    });

    setDoc(doc(fireDB, "users", user.uid), {
      email: user.email,
      name: responseData.name,
      department: responseData.department,
      pid: responseData.pid,
      role: "user",
      timeStamp: serverTimestamp(),
    });
    navigate("/");
    setResponseData(null);
  }

  useEffect(() => {
    if (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        theme: "light",
      });
    }
  }, [error]);

  return (
    <Box
      component="form"
      noValidate
      sx={{ mt: 5 }}
      onSubmit={formik.handleSubmit}
    >
      <Typography sx={{ fontWeight: 600, fontSize: 15 }} align="center" mb={3}>
        Create an account using you SFIT email and password
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MailOutlineRoundedIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            tField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <KeyRoundedIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      <LoadingButton
        loading={loading}
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign Up
      </LoadingButton>
      <ToastContainer />
    </Box>
  );
};
