import { useState, useEffect } from "react";
import { collection, getDocs, where, query } from "firebase/firestore";
import { fireDB } from "../firebase/firebaseConfig";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import DashboardGraph from "./DashboardGraph";


const AdminDashboard = () => {
  const [recentEvents, setRecentEvents] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    eventName: "All", // Modified default value to "All"
    department: "All",
    year: "All",
    div: "All",
  });

  useEffect(() => {
    fetchRecentEvents();
    fetchRegisteredUsers();
  }, []);

  const fetchRecentEvents = async () => {
    try {
      const eventsCollection = collection(fireDB, "events");
      const snapshot = await getDocs(eventsCollection);
      const eventsData = [];

      snapshot.forEach((doc) => {
        const event = doc.data();
        eventsData.push({ ...event, event_id: doc.id });
      });

      setRecentEvents(eventsData);
    } catch (error) {
      console.error("Error fetching recent events:", error);
    }
  };

  const fetchRegisteredUsers = async () => {
    try {
      const eventsCollection = collection(fireDB, "events");
      const eventsSnapshot = await getDocs(eventsCollection);
      const usersData = [];

      for (const doc of eventsSnapshot.docs) {
        const eventId = doc.id;
        const registrationCollection = collection(
          fireDB,
          "events",
          eventId,
          "registration"
        );
        const registrationSnapshot = await getDocs(registrationCollection);

        registrationSnapshot.forEach((doc) => {
          const userData = doc.data();
          usersData.push({ ...userData, eventId, user_id: doc.id });
        });
      }

      setRegisteredUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Error fetching registered users:", error);
    }
  };

  const handleFilterChange = async (event) => {
    const { name, value } = event.target;
    setFilterOptions((prevFilterOptions) => ({
      ...prevFilterOptions,
      [name]: value,
    }));

    if (name === "eventName" && value !== "All") {
      // Fetch registration users for the selected event
      try {
        const eventId = recentEvents.find((event) => event.event_name === value)?.event_id;
        if (eventId) {
          const registrationCollection = collection(
            fireDB,
            "events",
            eventId,
            "registration"
          );
          const registrationSnapshot = await getDocs(registrationCollection);
          const usersData = [];

          registrationSnapshot.forEach((doc) => {
            const userData = doc.data();
            usersData.push({ ...userData, eventId, user_id: doc.id });
          });

          setFilteredUsers(usersData);
        }
      } catch (error) {
        console.error("Error fetching registration users for the selected event:", error);
      }
    } else {
      applyFilters(); // Apply filters whenever a dropdown value changes
    }
  };

  const applyFilters = () => {
    let filteredData = registeredUsers;

    for (const key in filterOptions) {
      if (filterOptions[key] !== "All") {
        const filterValue = filterOptions[key].toLowerCase();
        filteredData = filteredData.filter(
          (user) => user[key] && user[key].toLowerCase().includes(filterValue)
        );
      }
    }

    setFilteredUsers(filteredData);
  };

  useEffect(() => {
    applyFilters();
  }, [filterOptions]);

  return (
    <div style={{ padding: "50px" }}>
      <Typography variant="h5" gutterBottom>
        Recent Events
      </Typography>
      <Grid container spacing={3}>
        {recentEvents.map((event, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: "100%", backgroundColor: getBgColor(index) }}>
              <CardMedia
                component="img"
                height="100"
                image={event.event_image}
                alt={event.event_name}
              />
              <CardContent>
                <Typography variant="h6" component="h2">
                  {event.event_name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Venue: {event.venue}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Date:{" "}
                  {event.date.startDate +
                    " " +
                    event.day +
                    " " +
                    event.time.start +
                    " To " +
                    event.time.end}
                </Typography>
                <Button
                  href={`/report/${event.event_id}`}
                  sx={{ color: "black", float: "right" }}
                >
                  View
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div style={{ padding: "30px" }}>
        <DashboardGraph />
      </div>
      <Typography variant="h5" gutterBottom style={{ marginTop: "20px" }}>
        Filter Users
      </Typography>
     
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <FormControl variant="outlined" size="small">
            <InputLabel htmlFor="eventName">Event Name</InputLabel>
            <Select
              sx={{ width: 200 }}
              value={filterOptions.eventName}
              onChange={handleFilterChange}
              inputProps={{
                name: "eventName",
                id: "eventName",
              }}
            >
              <MenuItem value="All">All</MenuItem>
              {recentEvents.map((event, index) => (
                <MenuItem key={index} value={event.event_name}>
                  {event.event_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl variant="outlined" size="small">
            <InputLabel htmlFor="department">Department</InputLabel>
            <Select
              sx={{ width: 200 }}
              value={filterOptions.department}
              onChange={handleFilterChange}
              inputProps={{
                name: "department",
                id: "department",
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="CMPN">CMPN</MenuItem>
              <MenuItem value="INFT">INFT</MenuItem>
              <MenuItem value="EXTC">EXTC</MenuItem>
              <MenuItem value="ELEC">ELEC</MenuItem>
              <MenuItem value="MECH">MECH</MenuItem>
            </Select>
            </FormControl>
        </Grid>
        <Grid item>
          <FormControl variant="outlined" size="small">
            <InputLabel htmlFor="year">Year</InputLabel>
            <Select
              sx={{ width: 200 }}
              value={filterOptions.year}
              onChange={handleFilterChange}
              inputProps={{
                name: "year",
                id: "year",
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="FE">FE</MenuItem>
              <MenuItem value="SE">SE</MenuItem>
              <MenuItem value="TE">TE</MenuItem>
              <MenuItem value="BE">BE</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl variant="outlined" size="small">
            <InputLabel htmlFor="div">Division</InputLabel>
            <Select
              sx={{ width: 200 }}
              value={filterOptions.division}
              onChange={handleFilterChange}
              inputProps={{
                name: "div",
                id: "division",
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="B">B</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Typography variant="h5" gutterBottom style={{ marginTop: "10px" }}>
        Registered Users
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>PID</TableCell>
            <TableCell>Department</TableCell>
            {/* <TableCell>Event Name</TableCell> */}
            <TableCell>Year</TableCell>
            <TableCell>Division</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <Typography variant="h5" style={{ marginTop: "20px" }}>
              Loading...
            </Typography>
          ) : (
            filteredUsers.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.pid}</TableCell>
                <TableCell>{user.department}</TableCell>
                {/* <TableCell>{user.event_name}</TableCell> */}
                <TableCell>{user.year}</TableCell>
                <TableCell>{user.div}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// Helper function to get background color based on index
const getBgColor = (index) => {
  switch (index%4) {
    case 0:
      return "#FFEBEE"; // Light Red
    case 1:
      return "#E3F2FD"; // Light Blue
    case 2:
      return "#E8F5E9"; // Light Green
    case 3:
      return "#FFFDE7"; // Light Yellow
    default:
      return "white"; // Default
  }
};

export default AdminDashboard;

