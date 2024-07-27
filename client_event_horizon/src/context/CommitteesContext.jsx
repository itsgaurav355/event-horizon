import { collection } from "firebase/firestore";
import { createContext } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { fireDB } from "../firebase/firbaseConfig";

export const committeesContext = createContext(null);

const CommitteesContext = ({ children }) => {
  const [committees, committees_loading, committees_error] = useCollection(
    collection(fireDB, "committees")
  );

  return (
    <committeesContext.Provider
      value={{ committees, committees_loading, committees_error }}
    >
      {children}
    </committeesContext.Provider>
  );
};

export default CommitteesContext;
