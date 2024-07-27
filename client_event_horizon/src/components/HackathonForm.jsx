import { Typography, Box, Select, MenuItem, Button } from "@mui/material/";

import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";

const HackathonForm = () => {
  const [count, setCount] = useState(4);

  const handleChange = (e) => {
    setCount(e.target.value);
  };

  return (
    <>
      <Box>
        <Typography
          variant="h6"
          fontWeight={600}
          align="left"
          color="initial"
          m={2}
        >
          Enter your Details
        </Typography>
        <Box px={2}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                label="Team's name with number of memebers
              "
                value=""
              />
              <Select variant="outlined" value={count} onChange={handleChange}>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
              </Select>
            </Box>
            <Typography
              variant="h6"
              fontWeight={600}
              align="left"
              color="initial"
            >
              Enter your contact details
            </Typography>
            <TextField
              fullWidth
              label="Email address or phone number"
              value=""
            />
          </Box>
        </Box>
        <Typography
          variant="h6"
          fontWeight={600}
          align="left"
          color="initial"
          m={2}
        >
          Enter your names with PID
        </Typography>
        <Box display="flex" gap={1} flexDirection="column">
          {Array.from({ length: count }).map((_, index) => (
            <Box key={index} display="flex" px={2} gap={1}>
              <TextField fullWidth label={`Member ${index + 1}`} value="" />
              <TextField fullWidth label="PID" value="" />
            </Box>
          ))}
        </Box>
        <Box p={4}>
          <Button variant="contained" fullWidth>
            Register
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default HackathonForm;
