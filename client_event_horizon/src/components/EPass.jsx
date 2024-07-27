import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Typography,
  CircularProgress,
} from "@mui/material";
import Image from "mui-image";
import QRCode from "react-qr-code";
import dj_night from "../assets/carousel_img/dj_night.webp";
import InsertInvitationRoundedIcon from "@mui/icons-material/InsertInvitationRounded";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { auth, fireDB } from "../firebase/firbaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";

const EPass = ({ props }) => {
  return (
    <Box maxWidth={370} p={2} pt={5}>
      <Box bgcolor="primary.light" my={2} component={Paper} overflow="hidden">
        <Box display="flex" flexDirection="column" overflow="hidden">
          <Box>
            <Image duration={0} src={props.event_image} height={180} />
          </Box>
          <Typography
            variant="h5"
            align="center"
            py={2}
            fontWeight={600}
            color="initial"
          >
            {props.event_name.length > 30
              ? props.event_name.substring(0, 30) + "..."
              : props.event_name}
          </Typography>
          <Divider />
          <Box
            display="flex"
            py={1}
            justifyContent="center"
            alignItems="center"
          >
            <List>
              <ListItem disablePadding>
                <ListItemIcon>
                  <InsertInvitationRoundedIcon sx={{ color: "primary.dark" }} />
                </ListItemIcon>
                <ListItemText>{props.event_date}</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon>
                  <AccessTimeOutlinedIcon sx={{ color: "primary.dark" }} />
                </ListItemIcon>
                <ListItemText>{props.event_time}</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon>
                  <LocationOnOutlinedIcon sx={{ color: "primary.dark" }} />
                </ListItemIcon>
                <ListItemText>
                  {props.event_venue.length > 30
                    ? props.event_venue.substring(0, 30) + "..."
                    : props.event_venue}
                </ListItemText>
              </ListItem>
            </List>
          </Box>
          <Divider
            sx={{
              borderStyle: "dotted",
              position: "relative",
              "&::before, &::after": {
                content: '""',
                position: "absolute",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: "white",
              },
              "&::before": {
                left: "-18px",
              },
              "&::after": {
                right: "-18px",
              },
            }}
          >
            {"- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - "}
          </Divider>
          <Box display="flex" justifyContent="center" p={2}>
            <QRCode
              value={`${props.qrcode}`}
              size={150}
              fgColor="#50409A"
              bgColor="#efeefc"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EPass;

import { Skeleton } from "@mui/material";

export const EPassSkeleton = ({ props }) => {
  if (!props) {
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
};
