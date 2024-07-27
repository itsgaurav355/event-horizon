import { Typography } from "@mui/material";
import RouterLink from "../components/RouterLink";

const ShowAllbtn = ({ to }) => {
  return (
    <>
      <RouterLink to={to}>
        <Typography variant="caption" color="text.grey" m={0} pr={2}>
          Show all {">"}
        </Typography>
      </RouterLink>
    </>
  );
};

export default ShowAllbtn;
