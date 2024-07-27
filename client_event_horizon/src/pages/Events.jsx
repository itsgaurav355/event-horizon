import {
  Box,
  TextField,
  InputAdornment,
  Chip,
  SwipeableDrawer,
  Typography,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Fade,
  Paper,
} from "@mui/material";
import "swiper/css";
import "swiper/css/free-mode";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EventCard, { EventCardSkeleton } from "../components/EventCard";
import { useContext, useEffect, useState } from "react";
import TuneIcon from "@mui/icons-material/Tune";
import { categoriesContext } from "../context/CategoriesContext";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { fireDB } from "../firebase/firbaseConfig";
import { TransitionGroup } from "react-transition-group";

const Events = () => {
  const { isOpen, setIsOpen, state, setState, filter, setFilter } =
    useContext(categoriesContext);

  const [searchText, setSearchText] = useState("");

  const { technical, workshops, sports, seminar, cultural } = state;

  const [events, events_loading] = useCollection(
    query(
      filter && filter.length > 0
        ? query(collection(fireDB, "events"), where("category", "in", filter))
        : query(
            collection(fireDB, "events"),
            where("event_name", ">=", searchText),
            where("event_name", "<", searchText + "\uf8ff")
          )
    )
  );

  useEffect(() => {
    return () => {
      // Reset the state
      setState({
        technical: false,
        workshops: false,
        sports: false,
        seminar: false,
        cultural: false,
      });

      // Reset the filter
      setFilter([]);
    };
  }, [setState, setFilter]);

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const handleClearAll = () => {
    Object.keys(state).forEach((key) => {
      if (state[key] === true) {
        // Call setState with the new state
        setState((prevState) => ({
          ...prevState,
          [key]: false, // or whatever new value you want to set
        }));
      }
    });
    setFilter([]);
    setIsOpen(false);
  };

  const handleDelete = (chipToDelete) => () => {
    setFilter((chips) => chips.filter((chip) => chip !== chipToDelete));
    setState((prevState) => ({
      ...prevState,
      [chipToDelete]: false,
    }));
  };

  const handleApplyFilter = () => {
    const trueKeys = Object.keys(state).filter((key) => state[key] === true);
    setFilter(trueKeys);
    setIsOpen(false);
  };

  return (
    <>
      <TransitionGroup>
        <Fade>
          <Box display="flex" flexDirection="column">
            <Box p={2}>
              <TextField
                placeholder="Search for Events"
                fullWidth
                onChange={(event) => {
                  setSearchText(event.target.value);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box
              px={2}
              display="flex"
              overflow="scroll"
              gap={2}
              sx={{
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Chip
                icon={<TuneIcon />}
                label="Filters"
                onClick={() => {
                  setIsOpen(true);
                }}
              />
              {filter.map((val, index) => (
                <Chip
                  key={index}
                  sx={{ textTransform: "capitalize" }}
                  label={`${val}`}
                  onDelete={handleDelete(val)}
                />
              ))}
            </Box>

            {events_loading ? (
              <>
                <TransitionGroup>
                  <Fade>
                    <Box
                      p={2}
                      display={{ xs: "flex", md: "none" }}
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      gap={3}
                    >
                      <EventCardSkeleton />
                      <EventCardSkeleton />
                      <EventCardSkeleton />
                      <EventCardSkeleton />
                    </Box>
                  </Fade>
                </TransitionGroup>
              </>
            ) : (
              <TransitionGroup>
                {events.docs.map((doc) => (
                  <Fade key={doc.id}>
                    <Box
                      p={2}
                      display={{ xs: "flex", md: "none" }}
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      gap={3}
                    >
                      <EventCard id={doc.id} props={doc.data()} />
                    </Box>
                  </Fade>
                ))}
              </TransitionGroup>
            )}
          </Box>
        </Fade>
      </TransitionGroup>
      <SwipeableDrawer
        anchor="bottom"
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <Box>
          <Typography variant="h6" color="initial" p={2}>
            Categories
          </Typography>
          <Divider color="black" />
          <Box p={2}>
            <FormGroup>
              <FormControlLabel
                name="technical"
                value="Technical"
                control={
                  <Checkbox onChange={handleChange} checked={technical} />
                }
                label="Technical"
              />
              <FormControlLabel
                name="workshops"
                value="WorkShops"
                control={
                  <Checkbox onChange={handleChange} checked={workshops} />
                }
                label="WorkShops"
              />
              <FormControlLabel
                name="sports"
                value="Sports"
                control={<Checkbox onChange={handleChange} checked={sports} />}
                label="Sports"
              />
              <FormControlLabel
                name="seminar"
                value="Seminar"
                control={<Checkbox onChange={handleChange} checked={seminar} />}
                label="Seminar"
              />{" "}
              <FormControlLabel
                name="cultural"
                value="Cultural"
                control={
                  <Checkbox onChange={handleChange} checked={cultural} />
                }
                label="Cultural"
              />
            </FormGroup>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={2}
            py={1}
          >
            <Button variat="text" size="large" onClick={handleClearAll}>
              Clear All
            </Button>
            <Button
              variant="contained"
              size="large"
              sx={{ width: 180 }}
              onClick={handleApplyFilter}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default Events;
