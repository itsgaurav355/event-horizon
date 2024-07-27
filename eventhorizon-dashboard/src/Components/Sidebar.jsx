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
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseConfig";
import Button from "@mui/material/Button";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import sfit from "../assets/sfit-logo.png";

export default function Sidebar({ toggleClose, isOpen }) {
  const [user] = useAuthState(auth);

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
    >
      {user ? (
        <List>
          <ListItem sx={{ pb: 0 }}>
            <ListItemAvatar>
              <Avatar
                sx={{ width: 80, height: 80 }}
                alt={user.displayName ?? "Name"}
                src={user.photoURL ?? ""}
              >
                {user.displayName ?? ""}
              </Avatar>
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
              secondary={user.email}
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
              <HomeRoundedIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Home" sx={{ fontSize: 100 }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => {
              navigate("add-report");
              toggleClose();
            }}>
            <ListItemIcon>
              <NotificationsRoundedIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Add Report" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate("add-event");
              toggleClose();
            }}
          >
            <ListItemIcon>
              <EventNoteRoundedIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Add Event" />
          </ListItemButton>
        </ListItem>

      
        <ListItem disablePadding>
          <ListItemButton
          onClick={() => {
            navigate("report/Ix2pUWjPcy4QLi45l1jO");
            toggleClose();
          }}>
            <ListItemIcon>
              <ConfirmationNumberRoundedIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Event Report" />
          </ListItemButton>
        </ListItem>
    
      </List>
    </Box>
  );

  return (
    <div>
      <SwipeableDrawer anchor="left" open={isOpen} onClose={toggleClose}>
        {list}
      </SwipeableDrawer>
    </div>
  );
}
