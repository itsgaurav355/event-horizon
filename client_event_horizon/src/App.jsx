import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Events from "./pages/Events";
import Home from "./pages/Home";
import Index from "./components/Index";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, fireDB } from "./firebase/firbaseConfig";
import CommitteesContext from "./context/CommitteesContext";
import BannersContext from "./context/BannersContext";
import CategoriesContext from "./context/CategoriesContext";
import SignUpContext from "./context/SignUpContext";
import IndexEvents from "./context/IndexEvents";
import EventBooking from "./pages/EventBooking";
import EventFormData from "./context/EventFormData";
import EPass from "./components/EPass";
import Passes from "./pages/Passes";
import { isMobile } from "react-device-detect";
import { SignUpForm, ScanIdCard, ConfirmDetails } from "./pages/SignUp";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import CustomForm from "./components/CustomForm";
import { CssBaseline } from "@mui/material";
import PaymentsAndRegistration from "./pages/PaymentsAndRegistration";
import ScanPass from "./pages/ScanPass";
import { useEffect } from "react";
import { setDoc } from "firebase/firestore";

defineCustomElements(window);

const PrivateRouteLogin = ({ children }) => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  return user ? navigate("/") : children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { index: true, element: <Index /> },
      {
        path: "signin",
        element: (
          <PrivateRouteLogin>
            <SignIn />
          </PrivateRouteLogin>
        ),
      },
      {
        path: "signup",
        element: <SignUp />,
        children: [
          { index: true, element: <ScanIdCard /> },
          {
            path: "2",
            element: <ConfirmDetails />,
          },
          { path: "3", element: <SignUpForm /> },
        ],
      },
      {
        path: "events",
        element: <Events />,
      },

      {
        path: "events/:eventid",
        element: <EventBooking />,
      },
      {
        path: "form/:eventid",
        element: <CustomForm />,
      },
      {
        path: "payments&regestrations",
        element: <PaymentsAndRegistration />,
      },
      {
        path: "passes",
        element: <Passes />,
      },
      {
        path: "scan",
        element: <ScanPass />,
      },
    ],
  },
]);

function App() {
  if (!isMobile) {
    return <div>Sorry, this website is only accessible on mobile devices.</div>;
  }

  return (
    <>
      <CssBaseline />
      <EventFormData>
        <IndexEvents>
          <SignUpContext>
            <CategoriesContext>
              <BannersContext>
                <CommitteesContext>
                  <RouterProvider router={router} />
                </CommitteesContext>
              </BannersContext>
            </CategoriesContext>
          </SignUpContext>
        </IndexEvents>
      </EventFormData>
    </>
  );
}

export default App;
