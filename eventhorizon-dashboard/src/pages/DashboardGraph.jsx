import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Typography, Grid, Select, MenuItem, Card, CardContent } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../firebase/firebaseConfig";

const DashboardGraph = () => {
  const [eventsData, setEventsData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [eventDetails, setEventDetails] = useState({});

  useEffect(() => {
    fetchEventsData();
  }, []);

  const fetchEventsData = async () => {
    try {
      const reportsCollection = collection(fireDB, "reports");
      const reportsSnapshot = await getDocs(reportsCollection);
      const allEventsData = [];
      const eventsDetails = {};

      reportsSnapshot.forEach((doc) => {
        const reportData = doc.data();
        allEventsData.push({
          event: reportData.event,
          registeredUsers: reportData.registeredUsers,
        });

        if (!eventsDetails[reportData.event]) {
          eventsDetails[reportData.event] = {
            registeredUsers: reportData.registeredUsers,
            attendees: reportData.attendees,
            absents: reportData.absents,
          };
        }
      });

      setEventDetails(eventsDetails);
      setEventsData(allEventsData);
    } catch (error) {
      console.error("Error fetching events data:", error);
    }
  };

  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: "white", padding: "10px", border: "1px solid #ccc" }}>
          <p>{`${label}`}</p>
          <p>{`Registered Users: ${data.registeredUsers}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} padding={2}>
          <Typography variant="h6" gutterBottom>
            Select Event
          </Typography>
          <Select value={selectedEvent} onChange={handleEventChange} fullWidth>
            <MenuItem value="">
              <em>Select Event</em>
            </MenuItem>
            {eventsData.map((event, index) => (
              <MenuItem key={index} value={event.event}>
                {event.event}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Event Comparison - Registered Users
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={eventsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="event" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {Object.keys(eventDetails).map((event, index) => (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey={`registeredUsers`}
                      name={event}
                      stroke={`#${Math.floor(Math.random() * 16777215).toString(
                        16
                      )}`}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          {selectedEvent && (
            <Card>
              <CardContent>
                <div style={{paddingLeft:50}}>
                  <Typography variant="h6" gutterBottom>
                    {selectedEvent} - Registered , Present , and Absents
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={[
                        {
                          name: "Registered",
                          value: eventDetails[selectedEvent]?.registeredUsers || 0,
                          color: "#8884d8",
                        },
                        {
                          name: "Present",
                          value: eventDetails[selectedEvent]?.attendees || 0,
                          color: "#82ca9d",
                        },
                        {
                          name: "Absent",
                          value: eventDetails[selectedEvent]?.absents || 0,
                          color: "#ffc658",
                        },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Students" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default DashboardGraph;
