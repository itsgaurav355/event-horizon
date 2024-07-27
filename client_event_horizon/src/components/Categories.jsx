import { Skeleton, Paper, Box, Typography } from "@mui/material";
import Image from "mui-image";

export const CategoriesSkeleton = () => {
  return (
    <Box my={2} mt={0} width={150} height={100}>
      <Skeleton
        variant="rectangular"
        animation="wave"
        height={"100%"}
        component={Paper}
      />
    </Box>
  );
};

const Categories = ({ props, handleCategories }) => {
  return (
    <>
      <Paper
        elevation={3}
        sx={{
          my: 2,
          mt: 0,
          width: 150,
          height: 100,
          overflow: "hidden",
          position: "relative",
        }}
        onClick={handleCategories}
      >
        <Image
          src={props.url}
          shift="right"
          sx={{
            position: "absolute", // Change this
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <Typography
          variant="h6"
          color="white"
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            textTransform: "capitalize",
          }}
        >
          {props.name}
        </Typography>
      </Paper>
    </>
  );
};

export default Categories;
