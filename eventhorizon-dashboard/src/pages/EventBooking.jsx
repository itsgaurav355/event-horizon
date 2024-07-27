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
  } from "@mui/material";
  import Image from "mui-image";
  import dj_night_banner from "../assets/carousel_img/dj_night.webp";
  import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
  import InsertInvitationRoundedIcon from "@mui/icons-material/InsertInvitationRounded";
  import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
  import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
  import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
  import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
  import { uid } from "uid";
  import { addDoc, collection } from "firebase/firestore";
import { fireDB } from "../firebase/firebaseConfig";
  const upcoming_events = [
    {
      id: uid(),
      event_image: dj_night_banner,
      event_name: "Iris DJ Night 2024",
      date: "Jul 21",
      price: "300",
      category: "Category",
      day: "Tue",
      time: {
        start: "4:30 AM",
        end: "5:30 AM",
      },
      college: "St.Francis Institue Of Technology, Borivali(East)",
      venue: "SFIT Quadrangle",
      online: false,
      about:
        "Join us for Iris DJ Night featuring Julia Bliss and Arayn Gala! Get ready for an unforgettable evening of non-stop music and dancing. Don't miss out – grab your friends and join the party!Join us for Iris DJ Night featuring Julia Bliss and Arayn Gala! Get ready for an unforgettable evening of non- stop music and dancing.Don't miss out – grab your friends and join the party!",
      instructions: [
        "🏢 Entry- Front gate only: We want to make sure you have a seamless and safe entry experience. Therefore, please note that the only entry point for the event will be from the college's front gate (through basketball court).",
        "🪪 ID Check: Bring your college ID and DJ NIGHT passes for entry. Entry will be given only after verification of COLLEGE ID. Other ID proofs such as Library card, etc. won't be verified.",
        "🚭 Zero Tolerance for Alcohol and Substances: Pre-consumption of alcohol and other illegal substances are strictly prohibited. If anyone is found intoxicated during the event, they will be rusticated.",
        "🎒 NO Bag ALLOWED: Except college ID, phone, passes, nothing else is allowed. TINY POCKET WALLETS FOR GIRLS (NO SLING BAGS/SIDE BAGS/FANNY BAGS) AND WALLETS FOR BOYS ALLOWED. The following items will be discarded at the entrance if found with you: • Water bottles (Water will be provided inside the campus) • Medicines without prescription • Makeup • Perfume/deodorant. PN: Please note that once any item is confiscated at the entrance, it becomes your responsibility, and it will not be the responsibility of the Student Council. We advise you to make sure that you bring only the permitted items and plan accordingly to avoid any inconveniences.",
        "👗 Dress Code: Dress appropriately in line with college standards. Inappropriate attire won't be permitted.",
        "🚫🔪 No Weapons: Possession of weapons or harmful objects is strictly forbidden.",
        "🚷 Re-entry: Re-entry after leaving the event is not permitted.",
      ],
    },
  ];
  
  const EventDetails = async() => {
  
  
    const handleAddPasses = async() => {
      const passRef = await addDoc(collection(fireDB,"registrations"),{
        upcoming_events
    }).then((docRef) => {
        console.log("Registered with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding event: ", error);
      });
    };
  
  
    return (
      <>
        <List>
          <ListItem disablePadding>
            <ListItemIcon>
              <InsertInvitationRoundedIcon />
            </ListItemIcon>
            <ListItemText>{upcoming_events[0].date}</ListItemText>
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <AccessTimeOutlinedIcon />
            </ListItemIcon>
            <ListItemText>
              {upcoming_events[0].time.start +
                " - " +
                upcoming_events[0].time.end}
            </ListItemText>
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <LocationOnOutlinedIcon />
            </ListItemIcon>
            <ListItemText>
              {upcoming_events[0].college + " | " + upcoming_events[0].venue}
            </ListItemText>
          </ListItem>
        </List>
      </>
    );
  };
  
  const BuyNow = () => {
    return (
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
            {`${String.fromCharCode(8377)}`}300
          </Typography>
        </Box>
        <Button variant="contained" size="large" sx={{ px: 3 }} onClick={handleAddPasses}>
          BUY NOW
        </Button>
      </Box>
    );
  };
  
  const EventBooking = () => {
    if (false) {
      return <EventBookingSkeleton />;
    }
  
    return (
      <Box mb={9}>
        <Box height={200}>
          <Image src={upcoming_events[0].event_image} />
        </Box>
  
        <Box p={2}>
          <Chip
            label={upcoming_events[0].category}
            size="small"
            color="primary"
          />
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography my={2} variant="h4" fontWeight={600} color="initial">
              Iris DJ Night 2024
            </Typography>
            <FavoriteBorderRoundedIcon />
          </Box>
          <EventDetails />
          <Divider />
          <Box>
            <Typography variant="h6" my={1}>
              About
            </Typography>
            <Typography variant="body1" fontStyle={"oblique"} color="initial">
              {upcoming_events[0].about}
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
                {upcoming_events[0].instructions.map((data) => (
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
              malesuada lacus ex, sit amet blandit leo lobortis eget.
            </AccordionDetails>
          </Accordion>
        </div>
        <BuyNow />
      </Box>
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
  