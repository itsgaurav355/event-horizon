/* eslint-disable react/prop-types */
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import WorkHistoryRoundedIcon from "@mui/icons-material/WorkHistoryRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firbaseConfig";
import Button from "@mui/material/Button";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import sfit from "../assets/sfit-logo.png";

export default function Sidebar({ toggleClose, isOpen }) {
  const [user] = useAuthState(auth);
  // const [value] = useDocumentData(doc(fireDB, "users",user.uid));

  const navigate = useNavigate();

  const logout = () => {
    signOut(auth);
  };

  const list = (
    <Box
      sx={{ width: 300 }}
      role="presentation"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      {user ? (
        <List>
          <ListItem sx={{ pb: 0 }}>
            <ListItemAvatar>
              <Avatar
                sx={{ width: 80, height: 80 }}
                alt={user.displayName ?? "Name"}
                src={user.photoURL ?? ""}
              />
            </ListItemAvatar>
          </ListItem>
          <ListItem disablePadding sx={{ px: 2 }}>
            <ListItemText
              primary={
                <>
                  <Typography variant="h6">
                    {user.displayName ?? "Name"}
                  </Typography>
                </>
              }
              secondary={
                <>
                  <Typography variant="subtitle1">{user.email}</Typography>
                  {/* <Typography variant="subtitle1">
                    {value.pid ?? "nul"}
                  </Typography> */}
                </>
              }
            />
          </ListItem>

          <ListItem>
            <Button size="small" variant="contained" onClick={logout}>
              Sign Out
            </Button>
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem sx={{ display: "flex", justifyContent: "center" }}>
            <ListItemAvatar>
              <Avatar sx={{ width: 90, height: 90 }} src={sfit} />
            </ListItemAvatar>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              size="large"
              startIcon={<EmailRoundedIcon />}
              variant="outlined"
              onClick={() => {
                navigate("/signin");
                toggleClose();
              }}
            >
              Sign In With Email{" "}
            </Button>
          </ListItem>
        </List>
      )}
      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate("/");
              toggleClose();
            }}
          >
            <ListItemIcon>
              <HomeRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Home" sx={{ fontSize: 100 }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate("events");
              toggleClose();
            }}
          >
            <ListItemIcon>
              <EventNoteRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Events" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate("passes");
              toggleClose();
            }}
          >
            <ListItemIcon>
              <ConfirmationNumberRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Passes" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate("payments&regestrations");
              toggleClose();
            }}
          >
            <ListItemIcon>
              <WorkHistoryRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Payments / Registrations" />
          </ListItemButton>
        </ListItem>
      </List>
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate("scan");
              toggleClose();
            }}
          >
            <ListItemIcon>
              <QrCodeScannerIcon />
            </ListItemIcon>
            <ListItemText primary="Scan E-Pass" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <SwipeableDrawer
        anchor="left"
        open={isOpen}
        onClose={toggleClose}
        onOpen={() => console.log("Drawer opened")}
      >
        {list}
      </SwipeableDrawer>
    </div>
  );
}
