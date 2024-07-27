import { auth } from "./firebase/firebaseConfig";

import { defineCustomElements } from "@ionic/pwa-elements/loader";
import AddEvent from "./pages/AddEvent";
import EventBooking from "./pages/EventBooking";
import Home from "./pages/Home";
import AddReport from "./pages/AddReport";
import EventReportPage from "./pages/EventReport"; // Import the EventReportPage component

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import AdminDashboard from "./pages/AdminDashboard";

defineCustomElements(window);
const PrivateRoute = ({ children }) => {
  const [user] = useAuthState(auth);
  return user ? <Navigate to="/" /> : children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { index: true, element: <AdminDashboard/> },
      {
        path: "events/:eventid",
        element: <EventBooking />,
      },
      {
        path: "add-event",
        element: <AddEvent />,
      },
      {
        path: "add-report",
        element: <AddReport />,
      },
     
      {
        path: "report/:eventId",
        element: <EventReportPage/> ,
      },
     
      // Add a new route for the event report page
      // {
      //   path: "events/5sQAbEfQgN1iWgRQCX94/report",
      //   element: <EventReportPage />,
      // },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

// user
export const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  if (user) {
    return children;
  } else {
    return <Navigate to={"/login"} />;
  }
};

export default App;
