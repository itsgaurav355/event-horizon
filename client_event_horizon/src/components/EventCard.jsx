/* eslint-disable react/prop-types */
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, Chip, Skeleton, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const EventCard = ({ id, props }) => {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => {
        navigate(`/events/${id}`);
      }}
    >
      <Card sx={{ width: 330 }}>
        <Box position="relative">
          <CardMedia
            sx={{ height: 120 }}
            image={props.event_image}
            title="DJ Night"
          />
        </Box>
        <CardContent>
          <Box display="flex" flexDirection="column" gap={1 / 2}>
            <Box display="flex" gap={1}>
              <Chip
                label={props.price === "0" ? "FREE" : "\u20B9" + props.price}
                size="small"
                color={"primary"}
              />
              <Chip
                label={props.category}
                size="small"
                sx={{ color: "text.grey", textTransform: "capitalize" }}
              />
            </Box>
            <Typography variant="caption" color="text.grey">
              {props.day +
                ", " +
                props.date +
                ", " +
                props.time.start +
                " - " +
                props.time.end}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {props.event_name}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export const EventCardSkeleton = () => {
  return (
    <Box
      component={Paper}
      sx={{
        width: 330,
        overflow: "hidden",
      }}
    >
      <Skeleton variant="rectangular" height={120} />

      <Box p={1}>
        <Skeleton variant="text" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="80%" />
      </Box>
    </Box>
  );
};
export default EventCard;
