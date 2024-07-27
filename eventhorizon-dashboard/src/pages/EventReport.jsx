import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../firebase/firebaseConfig";
import { Typography, Grid, Card, CardMedia } from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";

const EventReportPage = () => {
  const { eventId } = useParams();
  const [eventReport, setEventReport] = useState(null);
  const [departmentData, setDepartmentData] = useState([]);

  useEffect(() => {
    const fetchEventReport = async () => {
      try {
        const reportsCollection = collection(fireDB, "reports");
        const snapshot = await getDocs(reportsCollection);
        const reports = snapshot.docs.map((doc) => doc.data());
        const eventReportData = reports.find((report) => report.eventId === eventId);
        console.log(eventReportData);
        setEventReport(eventReportData);

        // Fetch registration data using eventId from the report
        if (eventReportData) {
          const registrationsRef = collection(fireDB, "events", eventId, "registration");
          const registrationsSnapshot = await getDocs(registrationsRef);
          const registrationData = registrationsSnapshot.docs.map((doc) => doc.data());

          // Calculate department-wise counts
          const departmentCounts = registrationData.reduce((acc, curr) => {
            acc[curr.department] = (acc[curr.department] || 0) + 1;
            return acc;
          }, {});

          const totalCount = Object.values(departmentCounts).reduce((total, count) => total + count, 0);
          // Prepare data for pie chart
          const departmentChartData = Object.keys(departmentCounts).map((department) => ({
            department,
            percentage: (departmentCounts[department] / totalCount) * 100,
          }));
          console.log(departmentChartData);
          setDepartmentData(departmentChartData);
        }
      } catch (error) {
        console.error("Error fetching event report:", error);
      }
    };
    fetchEventReport();
  }, [eventId]);

  if (!eventReport) {
    return <>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  <div>Loading Report ...</div>
</div></>;
  }
  // Generate series data for PieChart
  const seriesData = departmentData.map((department, index) => ({
    id: index,
    value: department.percentage,
    label: department.department,
  }));
  return (
    
    <div style={{ margin: 10, padding: 20 }}>
      <Card>
        <CardMedia
          component="img"
          image={"https://www.nicepng.com/png/full/202-2026085_header-triangle-pattern-grey-png.png"}
          alt={"Header"}
          style={{ height: 300, width: "100%", backgroundColor: "black", objectFit: 'cover' }} // Set fixed width and height
        />
      </Card>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', padding: '10px' }}>
        <Typography variant="h5" style={{ marginRight: 'auto' }}>{eventReport.event} Report</Typography>
        <Typography variant="h5">Date: {new Date().toLocaleDateString()}</Typography>
      </div>
      {/* Event Details Section */}
      <div>
        <Typography sx={{ padding: 1 }} variant="h5" gutterBottom>Event Details</Typography>
        <Typography sx={{ padding: 1 }} variant="body1" gutterBottom><strong>Event Name:</strong> {eventReport.event}</Typography>
        <Typography sx={{ padding: 1 , textAlign: 'justify'}} variant="body1" gutterBottom><strong>Description:</strong><br /> {eventReport.description}</Typography>
        <Typography sx={{ padding: 1 }} variant="body1" gutterBottom><strong>Total Earning:</strong> {eventReport.earning}</Typography>
        <Typography sx={{ padding: 1 }} variant="body1" gutterBottom><strong>Entry Fee:</strong> {eventReport.entryFee}</Typography>
        <Typography sx={{ padding: 1 }} variant="body1" gutterBottom><strong>Total Expenditure:</strong> {eventReport.expenditure}</Typography>
      </div>

      {/* Images Section */}
      <div style={{paddingBottom:50}}>
      <Typography variant="h5" gutterBottom>Event Images</Typography>
      <Grid container spacing={5} padding={2} >
        {eventReport.imageUrls.map((image, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Card>
              <CardMedia
                component="img"
                image={image}
                alt={`Image ${index}`}
                style={{ height: 300, width: 450, objectFit: 'cover' }} // Set fixed width and height
              />
            </Card>
          </Grid>
        ))}
      </Grid>
      </div>
      {/* Total Expenditure vs Earning Section */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card style={{ width: "100%", height: "100%", alignContent: "center", paddingBottom: 20 }}>
            <div style={{ paddingLeft: 100, paddingTop: 10 }}>
              <Typography variant="h5" gutterBottom>Total Expenditure vs Earning</Typography>
              <BarChart
                xAxis={[{ scaleType: "band", data: ["Expenditure", "Earning"] }]}
                series={[{ data: [eventReport.expenditure, eventReport.earning] }]}
                width={300}
                height={300}
              />
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card style={{ width: "100%", height: "100%", alignContent: "center", paddingBottom: 20 }}>
            <div style={{ paddingLeft: 50, paddingRight: 100, paddingTop: 10 }}>
              <Typography variant="h5" gutterBottom>Department-wise Registration Percentage</Typography>
              <PieChart
                series={[{ data: seriesData }]}
                width={400}
                height={300}
              />
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card style={{ width: "100%", height: "100%", alignContent: "center", paddingBottom: 20 }}>
            <div style={{ paddingLeft: 50, paddingRight: 50, paddingTop: 10 }}>
              <Typography variant="h5" gutterBottom>Registration Status</Typography>
              <BarChart
                xAxis={[{ scaleType: "band", data: ["Present", "Registered ", "Absentees"] }]}
                series={[
                  { data: [eventReport.attendees, eventReport.registeredUsers, eventReport.absents], color: "#2196F3" }
                ]}
                width={400}
                height={300}
              />
            </div>
          </Card>
        </Grid>
      </Grid>
    </div> 
  ) ;
};

export default EventReportPage;

