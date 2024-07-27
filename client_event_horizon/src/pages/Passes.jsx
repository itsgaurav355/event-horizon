import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, fireDB } from "../firebase/firbaseConfig";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import EPass, { EPassSkeleton } from "../components/EPass";
import { useEffect, useState } from "react";
import { Box, Fade } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { PrivacyScreen } from "@capacitor-community/privacy-screen";

const enable = async () => {
  await PrivacyScreen.enable();
};

const Passes = () => {
  const [user] = useAuthState(auth);
  const [uid, setUid] = useState(" ");

  useEffect(() => {
    enable();
    if (user) {
      setUid(user.uid);
    }
  }, [user]);

  const [passesData, loading] = useCollection(
    collection(fireDB, "users", uid, "passes")
  );

  if (loading) {
    return (
      <>
        <Box>
          <EPassSkeleton />
        </Box>
      </>
    );
  }

  return (
    <div>
      <Swiper slidesPerView={1} pagination={true} modules={[Pagination]}>
        {passesData.docs.map((doc) => {
          console.log(doc.data());
          return (
            <SwiperSlide key={doc.id}>
              <EPass props={doc.data()} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Passes;
