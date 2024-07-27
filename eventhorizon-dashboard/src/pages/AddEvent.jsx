import { useState, useEffect } from "react";

import {
  TextField,
  Button,
  Grid,
  Box,
  FormLabel,
  Typography,
  MenuItem,
  IconButton,
  Snackbar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { fireDB } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const AddEvent = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [eventData, setEventData] = useState({
    event_image: "",
    event_name: "",
    price: "",
    category: "",
    start: "",
    end: "",
    startDate: "",
    endDate: "",
    venue: "", // Added endTime field
    about: "",
    instructions: [""],
    committee: "",
    form: {
      pages: [],
    }, // Added formName field
  });
  const [formOptions, setFormOptions] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null); // Added state for form options
  useEffect(() => {
    const fetchFormOptions = async () => {
      try {
        const formsCollection = collection(fireDB, "forms");
        const snapshot = await getDocs(formsCollection);
        const forms = snapshot.docs.map((doc) => doc.id);
        setFormOptions(forms);
      } catch (error) {
        console.error("Error fetching form options:", error);
      }
    };

    fetchFormOptions();
  }, []);

  // Fetch form data based on selected form
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        if (selectedForm) {
          const formDocRef = doc(fireDB, "forms", selectedForm);
          const formDocSnapshot = await getDoc(formDocRef);
          const formData = formDocSnapshot.data();
          console.log(formData.pages);
          if (formData && formData.pages) {
            const pages = formData.pages;
            const formElements = pages.reduce((acc, page) => {
              const elements = page.elements.map((element) => ({
                name: element.name,
                title: element.title,
                type: element.type,
                isRequired: element.isRequired,
                choices: element.choices || [],
              }));
              return acc.concat(elements);
            }, []);
            setEventData((prevData) => ({
              ...prevData,
              form: {
                pages: [
                  {
                    name: "page1",
                    elements: formElements,
                  },
                ],
              },
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchFormData();
  }, [selectedForm]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newInstructions = [...eventData.instructions];
    newInstructions[index] = value;
    setEventData((prevData) => ({
      ...prevData,
      instructions: newInstructions,
    }));
  };

  const handleAddInstruction = () => {
    setEventData((prevData) => ({
      ...prevData,
      instructions: [...prevData.instructions, ""],
    }));
  };

  const handleRemoveInstruction = (index) => {
    const newInstructions = [...eventData.instructions];
    newInstructions.splice(index, 1);
    setEventData((prevData) => ({
      ...prevData,
      instructions: newInstructions,
    }));
  };

  const handleAddEvent = async (e) => {
    try {
      e.preventDefault();
      for (let key in eventData) {
        if (!eventData[key]) {
          setOpen(true);
          return;
        }
      }
     
      const eventRef = await addDoc(collection(fireDB, "events"), {
        event_image: eventData.event_image,
        event_name: eventData.event_name,
        price: eventData.price,
        category: eventData.category,
        college:"St.Francis Institute of Technology",
        day:"Wednesday",
        date: {
          startDate: eventData.startDate,
          endDate: eventData.endDate,
        },
        venue: eventData.venue,
        time: {
          start: eventData.start,
          end: eventData.end,
        },
        college: "St.Francis Insitute of Technology",
        about: eventData.about,
        instructions: eventData.instructions,
        committee: eventData.committee,
        form: eventData.form, // Include formName in the uploaded data
      });

      console.log("Event added with ID: ", eventRef.id);
      // Reset the formName field
      setEventData((prevData) => ({
        ...prevData,
        form: {},
      }));
      setEventData({
        event_image: "",
        event_name: "",
        price: "",
        category: "",
        startDate: "",
        endDate: "",
        venue: "",
        start: "",
        end: "",
        about: "",
        instructions: [""],
        committee: "",
        form: {
          pages: [],
        },
      });
      setSelectedForm(null);
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Add Event
      </Typography>
      <form action="" onSubmit={handleAddEvent}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="event_image"
              label="Image URL"
              fullWidth
              required
              value={eventData.event_image}
              onChange={(e) =>
                setEventData({ ...eventData, event_image: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="event_name"
              label="Event Name"
              fullWidth
              required
              value={eventData.event_name}
              onChange={(e) =>
                setEventData({ ...eventData, event_name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="Venue"
              label="Venue"
              fullWidth
              required
              value={eventData.venue}
              onChange={(e) =>
                setEventData({ ...eventData, venue: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="about"
              label="About"
              fullWidth
              required
              multiline={true}
              value={eventData.about}
              onChange={(e) =>
                setEventData({ ...eventData, about: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="price"
              label="Price"
              fullWidth
              required
              value={eventData.price}
              onChange={(e) =>
                setEventData({ ...eventData, price: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              name="category"
              label="Category"
              fullWidth
              required
              value={eventData.category}
              onChange={(e) =>
                setEventData({ ...eventData, category: e.target.value })
              }
            >
              <MenuItem value="workshops">Workshop</MenuItem>
              <MenuItem value="seminar">Seminar</MenuItem>
              <MenuItem value="sports">Sports</MenuItem>
              <MenuItem value="cultural">Cultural</MenuItem>
              <MenuItem value="technical">Technical</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormLabel>Start Date</FormLabel>
            <TextField
              name="startDate"
              type="date"
              fullWidth
              required
              value={eventData.startDate}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  startDate: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormLabel>Start Time</FormLabel>
            <TextField
              name="start"
              type="time"
              fullWidth
              required
              value={eventData.start}
              onChange={(e) =>
                setEventData({ ...eventData, start: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormLabel>End Date</FormLabel>
            <TextField
              name="endDate"
              type="date"
              fullWidth
              required
              value={eventData.endDate}
              onChange={(e) =>
                setEventData({ ...eventData, endDate: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormLabel>End Time</FormLabel>
            <TextField
              name="end"
              type="time"
              fullWidth
              required
              value={eventData.end}
              onChange={(e) =>
                setEventData({ ...eventData, end: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              name="committee"
              label="Committee"
              fullWidth
              required
              value={eventData.committee}
              onChange={(e) =>
                setEventData({ ...eventData, committee: e.target.value })
              }
            >
              <MenuItem value="ISTE">ISTE</MenuItem>
              <MenuItem value="ITSA">ITSA</MenuItem>
              <MenuItem value="IEEE">IEEE</MenuItem>
              <MenuItem value="EESA">EESA</MenuItem>
              <MenuItem value="MESA">MESA</MenuItem>
              <MenuItem value="SC">SC</MenuItem>
              <MenuItem value="others">Others</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              name="formName"
              label="Form Type"
              fullWidth
              required
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
            >
              {formOptions.map((form, index) => (
                <MenuItem key={index} value={form}>
                  {form}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Instructions:</Typography>
            {eventData.instructions.map((instruction, index) => (
              <Grid container spacing={2} alignItems="center" key={index}>
                <Grid item xs={10}>
                  <TextField
                    name={`instruction-${index}`}
                    label={`Instruction ${index + 1}`}
                    fullWidth
                    value={instruction}
                    onChange={(e) => handleChange(e, index)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    color="primary"
                    onClick={() => handleRemoveInstruction(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button startIcon={<AddIcon />} onClick={handleAddInstruction}>
              Add Instruction
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddEvent}
            >
              Add Event
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        message="Please fill all fields"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        ContentProps={{
          style: { backgroundColor: "red", color: "white" },
        }}
      />
    </Box>
  );
};

export default AddEvent;
