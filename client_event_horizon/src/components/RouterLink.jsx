import { Link } from "react-router-dom";

const RouterLink = ({ to, children }) => {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      {children}
    </Link>
  );
};

export default RouterLink;
