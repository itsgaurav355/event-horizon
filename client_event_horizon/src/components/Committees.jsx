/* eslint-disable react/prop-types */
import { Box, Avatar, Typography, Skeleton } from "@mui/material";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import "swiper/css";
import "swiper/css/autoplay";

const Committees = ({ props }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap={2}
      border={1}
      borderColor="colors.border"
      borderRadius={2}
      height={50}
      p={2}
    >
      <Avatar
        src={props.imageUrl ?? ""}
        sx={{
          width: 50,
          height: 50,
        }}
      />

      <Typography
        variant="subtitle2"
        fontSize={{ md: 15 }}
        sx={
          props.name?.length > 50
            ? {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }
            : {}
        }
      >
        {props.name ?? " "}
      </Typography>

      <NavigateNextRoundedIcon fontSize="small" />
    </Box>
  );
};

export const CommitteesSkeleton = () => {
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        border={1}
        borderColor="colors.border"
        borderRadius={2}
        height={50}
        p={2}
      >
        <Skeleton variant="circular" width={50} height={50} animation="wave" />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="start"
          animation="wave"
        >
          <Skeleton animation="wave" variant="text" width={150} height={18} />
          <Skeleton animation="wave" variant="text" width={150} height={18} />
        </Box>
        <NavigateNextRoundedIcon fontSize="small" />
      </Box>
    </>
  );
};

export default Committees;
