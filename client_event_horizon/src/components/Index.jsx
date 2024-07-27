import BannerCarousel from "./BannerCarousel";
import { Typography, Box, Fade, Button } from "@mui/material";
import EventCard, { EventCardSkeleton } from "./EventCard";
import Committees from "./Committees";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import ShowAllbtn from "./ShowAllbtn";
import { FreeMode } from "swiper/modules";
import Categories from "./Categories";
import { useContext, useEffect } from "react";
import { committeesContext } from "../context/CommitteesContext";
import { CommitteesSkeleton } from "./Committees";
import { categoriesContext } from "../context/CategoriesContext";
import { CategoriesSkeleton } from "./Categories";
import { useNavigate } from "react-router-dom";
import { indexEvents } from "../context/IndexEvents";
import { TransitionGroup } from "react-transition-group";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";

const Index = () => {
  const { committees, committees_loading } = useContext(committeesContext);
  const { categories, categories_loading, setState, setFilter } =
    useContext(categoriesContext);
  const { upcoming_events, upcoming_events_loading } = useContext(indexEvents);

  const navigate = useNavigate();

  // useEffect(() => {
  //   const setData = async () => {
  //     await setDoc(doc(fireDB, "events", "tEQWWni0f5nUXE26fr9T"), {
  //       event_image:
  //         "https://firebasestorage.googleapis.com/v0/b/eventhorizon-196ed.appspot.com/o/banners%2Fdj_night.webp?alt=media&token=34cc600b-6969-44cc-93db-b3e5e7be23fe",
  //       event_name: "Iris DJ Night 2024",
  //       date: "Jul 21",
  //       price: "300",
  //       category: "Music",
  //       day: "Tue",
  //       time: {
  //         start: "4:30 AM",
  //         end: "5:30 AM",
  //       },
  //       form: {
  //         pages: [
  //           {
  //             name: "page1",
  //             elements: [
  //               {
  //                 type: "text",
  //                 name: "name",
  //                 title: "Name",
  //                 isRequired: true,
  //               },
  //               {
  //                 type: "dropdown",
  //                 name: "department",
  //                 title: "Department",
  //                 isRequired: true,
  //                 choices: ["INFT", "EXTC", "ELEC", "CMPN", "MECH"],
  //               },
  //               {
  //                 type: "dropdown",
  //                 name: "year",
  //                 title: "Year",
  //                 isRequired: true,
  //                 choices: ["FE", "SE", "TE", "BE"],
  //               },
  //               {
  //                 type: "dropdown",
  //                 name: "div",
  //                 title: "Division",
  //                 isRequired: true,
  //                 choices: ["A", "B"],
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       college: "St. Francis Institute Of Technology, Borivali (East)",
  //       venue: "SFIT Quadrangle",
  //       online: false,
  //       about:
  //         "Join us for Iris DJ Night featuring Julia Bliss and Arayn Gala! Get ready for an unforgettable evening of non-stop music and dancing. Don't miss out – grab your friends and join the party!",
  //       instructions: [
  //         "🏢 Entry- Front gate only: We want to make sure you have a seamless and safe entry experience. Therefore, please note that the only entry point for the event will be from the college's front gate (through basketball court).",
  //         "🪪 ID Check: Bring your college ID and DJ NIGHT passes for entry. Entry will be given only after verification of COLLEGE ID. Other ID proofs such as Library card, etc. won't be verified.",
  //         "🚭 Zero Tolerance for Alcohol and Substances: Pre-consumption of alcohol and other illegal substances are strictly prohibited. If anyone is found intoxicated during the event, they will be rusticated.",
  //         "🎒 NO Bag ALLOWED: Except college ID, phone, passes, nothing else is allowed. TINY POCKET WALLETS FOR GIRLS (NO SLING BAGS/SIDE BAGS/FANNY BAGS) AND WALLETS FOR BOYS ALLOWED. The following items will be discarded at the entrance if found with you: • Water bottles (Water will be provided inside the campus) • Medicines without prescription • Makeup • Perfume/deodorant. PN: Please note that once any item is confiscated at the entrance, it becomes your responsibility, and it will not be the responsibility of the Student Council. We advise you to make sure that you bring only the permitted items and plan accordingly to avoid any inconveniences.",
  //         "👗 Dress Code: Dress appropriately in line with college standards. Inappropriate attire won't be permitted.",
  //         "🚫🔪 No Weapons: Possession of weapons or harmful objects is strictly forbidden.",
  //         "🚷 Re-entry: Re-entry after leaving the event is not permitted.",
  //       ],
  //     });
  //     console.log("Data set successfully!");
  //   };
  //   setData();
  // }, []);

  return (
    <TransitionGroup>
      <Fade>
        <Box>
          <BannerCarousel />
          {/* Categories */}
          <Box mt={2} display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6" px={2}>
              Categories
            </Typography>
            <Box>
              <Swiper
                slidesPerView={2.5}
                slidesOffsetBefore={16}
                slidesOffsetAfter={16}
                spaceBetween={50}
                modules={[FreeMode]}
              >
                {categories_loading ? (
                  <>
                    <SwiperSlide>
                      <CategoriesSkeleton />
                    </SwiperSlide>
                    <SwiperSlide>
                      <CategoriesSkeleton />
                    </SwiperSlide>
                    <SwiperSlide>
                      <CategoriesSkeleton />
                    </SwiperSlide>
                  </>
                ) : (
                  categories.docs.map((doc) => {
                    return (
                      <Fade
                        key={doc.id}
                        in={
                          upcoming_events_loading &&
                          categories_loading &&
                          committees_loading
                        }
                      >
                        <SwiperSlide>
                          <Categories
                            props={doc.data()}
                            handleCategories={() => {
                              // Update the state
                              setState((prevState) => ({
                                ...prevState,
                                [doc.data().name]: true,
                              }));

                              // Update the filter
                              setFilter((prevFilter) => [
                                ...prevFilter,
                                doc.data().name,
                              ]);
                              navigate("/events");
                            }}
                          />
                        </SwiperSlide>
                      </Fade>
                    );
                  })
                )}
              </Swiper>
            </Box>
          </Box>
          {/* Committess */}
          <Box my={2} mb={3} display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6" px={2}>
              Discover Events by Committees
            </Typography>

            <Box>
              <Swiper
                slidesPerView={1.2}
                freeMode={true}
                spaceBetween={13}
                slidesOffsetBefore={16}
                slidesOffsetAfter={16}
                breakpoints={{
                  640: {
                    slidesPerView: 4,
                    spaceBetween: 50,
                  },
                }}
                modules={[FreeMode]}
              >
                {committees_loading ? (
                  <>
                    <SwiperSlide>
                      <CommitteesSkeleton />
                    </SwiperSlide>
                    <SwiperSlide>
                      <CommitteesSkeleton />
                    </SwiperSlide>
                  </>
                ) : (
                  committees.docs.map((doc) => (
                    <Fade
                      key={doc.id}
                      in={
                        upcoming_events_loading &&
                        categories_loading &&
                        committees_loading
                      }
                    >
                      {" "}
                      <SwiperSlide key={doc.id}>
                        <Committees props={doc.data()} />
                      </SwiperSlide>
                    </Fade>
                  ))
                )}
              </Swiper>
            </Box>
          </Box>
          {/* Upcoming Events */}
          <Box display="flex" flexDirection="column" gap={2}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6" px={2}>
                Upcoming Events
              </Typography>
              <ShowAllbtn to="events" />
            </Box>
            <Box
              pb={2}
              display={{ xs: "flex", md: "none" }}
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap={3}
            >
              {upcoming_events_loading ? (
                <>
                  <EventCardSkeleton />
                  <EventCardSkeleton />
                  <EventCardSkeleton />
                </>
              ) : (
                upcoming_events.docs.map((doc) => (
                  <Box key={doc.id}>
                    <EventCard id={doc.id} props={doc.data()} />
                  </Box>
                ))
              )}
              <ShowAllbtn to="events" />
            </Box>
          </Box>
        </Box>
      </Fade>
    </TransitionGroup>
  );
};

export default Index;
