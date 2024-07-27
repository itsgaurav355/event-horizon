import { useEffect, useState } from "react";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import { auth, fireDB } from "../firebase/firbaseConfig";
import {
  BarcodeScanner,
  BarcodeFormat,
} from "@capacitor-mlkit/barcode-scanning";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import {
  Avatar,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NumbersRoundedIcon from "@mui/icons-material/NumbersRounded";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

const ScanPass = () => {
  const [events, loading] = useCollection(collection(fireDB, "events"));
  const [eventID, setEventID] = useState("");
  const [registrationData, setRegistrationData] = useState("");
  const [userID, setUserID] = useState("");
  const [userData, setUserData] = useState({});
  const [open, setOpen] = useState(false);

  const checkIn = async (eventid, uid) => {
    if (registrationData) {
      const attendeesCollection = collection(
        fireDB,
        "events",
        eventid,
        "attendees"
      );
      const q = query(attendeesCollection, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.info("E-Pass has already been scanned");
      } else {
        const docRef = await addDoc(attendeesCollection, {
          uid: uid,
          ...registrationData,
        });
        if (docRef) {
          toast.success("Check In Successful");
        }
      }
    }
    setOpen(false);
  };

  const scan = async () => {
    const { barcodes } = await BarcodeScanner.scan({
      formats: [BarcodeFormat.QrCode],
    });
    return barcodes[0].rawValue;
  };

  const scanQRCode = async (eventid) => {
    let uid = " ";
    const hashValue = await scan();

    const q = query(
      collection(fireDB, "events", eventid, "generatedPasses"),
      where("qrcode", "==", hashValue)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      const data = doc.data();
      uid = data.user;
      setUserID(uid);
    });

    const userDoc = await getDoc(doc(fireDB, "users", uid));
    if (userDoc.exists()) {
      const userDetails = userDoc.data();
      setUserData(userDetails);
      setOpen(true);
      // Fetch registration data where the name matches
      const registrationQuery = query(
        collection(fireDB, "events", eventid, "registration"),
        where("name", "==", userDetails.name)
      );
      const registrationSnapshot = await getDocs(registrationQuery);
      registrationSnapshot.forEach((doc) => {
        const registrationData = doc.data();
        // Store registration data in state
        setRegistrationData(registrationData);
      });
    } else {
      console.log("User not found");
      toast("Not Found", {
        theme: "colored",
      });
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <ToastContainer />
      <Box display="flex" flexDirection="column" gap={2} p={2}>
        {events.docs.map((doc) => {
          const detail = doc.data();
          return (
            <Box
              onClick={() => {
                try {
                  scanQRCode(doc.id);
                  setEventID(doc.id);
                } catch (e) {
                  console.error(e);
                }
              }}
              component={Paper}
              elevation={0}
              border={1}
              borderColor="colors.border"
              key={doc.id}
              display="flex"
              alignItems="center"
              justifyContent="start"
              gap={2}
              height={50}
              py={5}
              px={2}
            >
              <Avatar
                src={detail.event_image ?? ""}
                sx={{
                  width: 60,
                  height: 60,
                }}
              />

              <Typography
                variant="subtitle2"
                width={200}
                fontSize={{ md: 20 }}
                sx={
                  detail.event_name?.length > 50
                    ? {
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }
                    : {}
                }
              >
                {detail.event_name ?? " "}
              </Typography>

              <NavigateNextRoundedIcon fontSize="small" />
            </Box>
          );
        })}
      </Box>
      <SwipeableDrawer
        open={open}
        anchor="bottom"
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box display="flex" alignItems="start" flexDirection="column">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <Avatar
              src={""}
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
                {userData?.name}
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
                {userData?.department}
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
                {userData?.pid}
              </Typography>
              <Typography variant="subtitle2" color="primary">
                PID
              </Typography>
            </Box>
          </Box>
          <Box width={"100%"} display="flex" justifyContent="center" py={3}>
            <Button
              variant="contained"
              onClick={() => {
                checkIn(eventID, userID);
              }}
            >
              CHECK IN
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>
    </div>
  );
};

export default ScanPass;
