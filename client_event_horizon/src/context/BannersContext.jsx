import { createContext } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { fireDB } from "../firebase/firbaseConfig";
import { collection } from "firebase/firestore";

export const bannerContext = createContext(null);

const BannersContext = ({ children }) => {
  const [banner, banner_loading, banner_error] = useCollection(
    collection(fireDB, "banners")
  );

  return (
    <>
      <bannerContext.Provider value={{ banner, banner_loading, banner_error }}>
        {children}
      </bannerContext.Provider>
    </>
  );
};

export default BannersContext;
