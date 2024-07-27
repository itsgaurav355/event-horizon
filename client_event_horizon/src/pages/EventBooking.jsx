import {
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
  Fade,
  Checkbox,
} from "@mui/material";
import Image from "mui-image";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import Favorite from "@mui/icons-material/Favorite";
import InsertInvitationRoundedIcon from "@mui/icons-material/InsertInvitationRounded";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { doc, collection, addDoc, query, where } from "firebase/firestore";
import { auth, fireDB } from "../firebase/firbaseConfig";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDocumentData, useCollection } from "react-firebase-hooks/firestore";
import { ToastContainer, toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { redirectPaymentGateway } from "../../services/razorpayService";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

const EventDetails = ({ props }) => {
  return (
    <>
      <List>
        <ListItem disablePadding>
          <ListItemIcon>
            <InsertInvitationRoundedIcon />
          </ListItemIcon>
          <ListItemText>{props.date}</ListItemText>
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon>
            <AccessTimeOutlinedIcon />
          </ListItemIcon>
          <ListItemText>
            {props.time.start + " - " + props.time.end}
          </ListItemText>
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon>
            <LocationOnOutlinedIcon />
          </ListItemIcon>
          <ListItemText>{props.college + " | " + props.venue}</ListItemText>
        </ListItem>
      </List>
    </>
  );
};

const BuyNow = ({ props, id, uid }) => {
  const param = useParams();
  const [user] = useAuthState(auth);
  // const [uid, setUid] = useState(" ");

  // useEffect(() => {
  //   if (user) {
  //     setUid(user.uid);
  //   }
  // }, [user]);

  const [data, loading] = useCollection(
    query(
      collection(fireDB, "users", uid, "paymentsandRegistrations"),
      where("status", "==", "success")
    )
  );

  const navigate = useNavigate();
  return (
    <>
      <Box
        position="fixed"
        p={2}
        bottom={0}
        component={Paper}
        width="100%"
        elevation={6}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center" gap={1}>
          <AccountBalanceWalletIcon fontSize="large" />
          <Typography variant="h6" color="initial">
            {props.price == "0"
              ? "Free"
              : `${String.fromCharCode(8377)}${props.price}`}
          </Typography>
        </Box>
        <Button
          id="rzp-button1"
          variant="contained"
          size="large"
          sx={{}}
          onClick={() => {
            console.log("clicked");
            const isEventAlreadyRegistered = data.docs.some(
              (doc) => doc.data().event_name === props.event_name
            );

            const register = async () => {
              const IST = new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kolkata",
              });

              const ISTDate = new Date(IST);
              const formattedDate = ISTDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              await addDoc(
                collection(fireDB, "users", uid, "paymentsandRegistrations"),
                {
                  event_name: props.event_name,
                  status: "success",
                  amount: props.price,
                  day: formattedDate,
                }
              );
              await addDoc(collection(fireDB, "users", uid, "passes"), {
                user: uid,
                event_image: props.event_image,
                event_name: props.event_name,
                event_date: props.date,
                event_time: props.time.start + " - " + props.time.end,
                event_venue: props.college + " | " + props.venue,
                qrcode: CryptoJS.SHA256(
                  JSON.stringify({
                    amount: props.price,
                    user: uid,
                    event_image: props.event_image,
                    event_name: props.event_name,
                    event_date: props.date,
                    event_time: props.time.start + " - " + props.time.end,
                    event_venue: props.college + " | " + props.venue,
                  })
                ).toString(),
              });
              await addDoc(
                collection(fireDB, "events", param.eventid, "generatedPasses"),
                {
                  user: uid,
                  qrcode: CryptoJS.SHA256(
                    JSON.stringify({
                      amount: props.price,
                      user: uid,
                      event_image: props.event_image,
                      event_name: props.event_name,
                      event_date: props.date,
                      event_time: props.time.start + " - " + props.time.end,
                      event_venue: props.college + " | " + props.venue,
                    })
                  ).toString(),
                }
              );
            };

            if (!user) {
              navigate("/signin");
              return;
            }

            if (isEventAlreadyRegistered) {
              toast.error("You can only register once for each event.");
              return;
            }

            if (props.form) {
              navigate(`/form/${id}`);
              return;
            }

            if (props.price == "0" && !("form" in props)) {
              register();
              navigate("/payments&regestrations");
              return;
            }

            redirectPaymentGateway(
              Number(props.price),
              props.event_name,
              uid,
              param.eventid,
              props.event_image,
              props.college + "|" + props.venue,
              props.date,
              props.time.start + " - " + props.time.end
            );

            setTimeout(() => {
              navigate("/payments&regestrations");
            }, 2000);
          }}
        >
          <EastRoundedIcon />
        </Button>
      </Box>
      <ToastContainer />
    </>
  );
};

const EventBooking = () => {
  const param = useParams();
  const [user, user_loading] = useAuthState(auth);
  const [data, loading] = useDocumentData(doc(fireDB, "events", param.eventid));

  console.log(data);
  if (loading) {
    return <EventBookingSkeleton />;
  }

  return (
    <Fade in={!loading}>
      <Paper>
        <Box mb={9}>
          <Box height={200}>
            <Image src={data.event_image} />
          </Box>

          <Box p={2}>
            <Chip
              label={data.category}
              size="small"
              color="primary"
              sx={{ textTransform: "capitalize" }}
            />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography my={2} variant="h4" fontWeight={600} color="initial">
                {data.event_name}
              </Typography>
              <Checkbox
                icon={<FavoriteBorderRoundedIcon />}
                checkedIcon={<Favorite color="error" />}
              />
            </Box>
            <EventDetails props={data} />
            <Divider />
            <Box>
              <Typography variant="h6" my={1}>
                About
              </Typography>
              <Typography variant="body1" fontStyle={"oblique"} color="initial">
                {data.about}
              </Typography>
            </Box>
          </Box>

          <div>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography variant="h6" my={1}>
                  Instructions
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List disablePadding>
                  {data.instructions.map((data) => (
                    <ListItem key={data.id}>
                      <ListItemText>
                        <Typography variant="body2" color="initial">
                          {data}
                        </Typography>
                      </ListItemText>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                <Typography variant="h6" my={1}>
                  Terms & Conditions
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </AccordionDetails>
            </Accordion>
          </div>
          <BuyNow props={data} id={param.eventid} uid={user.uid} />
        </Box>
      </Paper>
    </Fade>
  );
};

const EventBookingSkeleton = () => {
  return (
    <Box mb={9}>
      <Box height={200}>
        <Skeleton variant="rectangular" width="100%" height={200} />
      </Box>
      <Box p={2}>
        <Skeleton variant="text" width="80px" />
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Skeleton variant="text" width="50%" />
        </Box>
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Box>
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
        </Box>
      </Box>

      <Box p={2}>
        <Skeleton variant="text" width="100%" />
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Skeleton variant="text" width="100%" />
        </Box>
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Box>
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
        </Box>
      </Box>
      <Box
        position="fixed"
        p={2}
        bottom={0}
        component={Paper}
        width="100%"
        elevation={6}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Skeleton variant="rectangular" width="100%" height={50} />
      </Box>
    </Box>
  );
};

export default EventBooking;
