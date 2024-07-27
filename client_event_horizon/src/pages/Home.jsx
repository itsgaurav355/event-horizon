import { Typography, Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

import Sidebar from "../components/Sidebar";

import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    scrollTo(0, 0);
  });

  return (
    <>
      <Sidebar isOpen={isOpen} toggleClose={() => setIsOpen(false)} />
      <Box display="flex" alignItems="center" gap={2} bgcolor="primary.main">
        <IconButton onClick={() => setIsOpen(true)}>
          <MenuIcon fontSize="large" />
        </IconButton>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h5" fontWeight={600} width="fit-content">
            EventHorizon
          </Typography>
          <ClearRoundedIcon fontSize="small" />
          <Typography variant="h5" fontWeight={300} width="fit-content">
            SFIT
          </Typography>
        </Box>
      </Box>
      <Outlet />
    </>
  );
};

export default Home;
