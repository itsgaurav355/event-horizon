import dj_night_banner from "../assets/carousel_img/dj_night.webp";
import hackathonImage from "../assets/carousel_img/hackathon_bannerr.jpg";
import { uid } from "uid";

const upcoming_events = [
  {
    id: uid(),
    event_image: dj_night_banner,
    event_name: "Iris DJ Night 2024",
    date: "Jul 21",
    price: "300",
    category: "Technical",
    day: "Tue",
    time: {
      start: "4:30 AM",
      end: "5:30 AM",
    },
    college: "SFIT",
    online: false,
  },
  {
    id: uid(),
    event_image: hackathonImage,
    event_name: "Hackathon 2024",
    date: "Jul 21",
    price: "300",
    category: "Hackathons and Tech Events",
    day: "Tue",
    time: {
      start: "4:30 AM",
      end: "5:30 AM",
    },
    college: "SFIT",
    online: false,
  },
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
    college: "SFIT",
    online: false,
  },
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
    college: "SFIT",
    online: false,
  },
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
    college: "SFIT",
    online: false,
  },
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
    college: "SFIT",
    online: false,
  },
];

export default upcoming_events;
