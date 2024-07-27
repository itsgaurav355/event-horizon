import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Skeleton,
  Fade,
  Box,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { auth, fireDB } from "../firebase/firbaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { TransitionGroup } from "react-transition-group";
import { useState, useEffect } from "react";

const PaymentsAndRegistration = () => {
  const [user] = useAuthState(auth);
  const [uid, setUid] = useState(" ");
  const [data, loading] = useCollection(
    collection(fireDB, "users", uid, "paymentsandRegistrations")
  );

  useEffect(() => {
    if (user) {
      setUid(user.uid);
    }
  }, [user]);

  if (!user) {
    return (
      <>
        <div>You need to login</div>
      </>
    );
  }

  return (
    <>
      <TransitionGroup>
        <Fade>
          <Box>
            <List>
              {loading
                ? Array.from(new Array(12)).map((_, index) => (
                    <ListItem key={index}>
                      <Skeleton variant="rounded" width={"100%"} height={60} />
                    </ListItem>
                  ))
                : data.docs.map((doc) => {
                    const item = doc.data();
                    return (
                      <>
                        <ListItem
                          sx={{ height: 120 }}
                          key={item.event_name}
                          secondaryAction={
                            <Typography variant="h6">
                              {item.amount == "0" ? "FREE" : "₹" + item.amount}
                            </Typography>
                          }
                        >
                          <ListItemIcon>
                            {item.status == "success" ? (
                              <CheckCircleIcon color="success" />
                            ) : (
                              <CancelIcon color="error" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            sx={{
                              "& .MuiListItemText-primary": {
                                fontWeight: 600,
                                fontSize: 20,
                                width: 200,
                              },
                              "& .MuiListItemText-secondary": {
                                fontWeight: 600,
                              },
                              width: 50,
                            }}
                            primary={item.event_name}
                            secondary={item.day}
                          />
                        </ListItem>
                        <Divider />
                      </>
                    );
                  })}
            </List>
          </Box>
        </Fade>
      </TransitionGroup>
    </>
  );
};

export default PaymentsAndRegistration;
