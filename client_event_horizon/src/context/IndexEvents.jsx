import { collection, query, limit } from "firebase/firestore";
import React, { createContext } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { fireDB } from "../firebase/firbaseConfig";

export const indexEvents = createContext();

const IndexEvents = ({ children }) => {
  const [upcoming_events, upcoming_events_loading] = useCollection(
    query(collection(fireDB, "events"), limit(5))
  );

  return (
    <indexEvents.Provider value={{ upcoming_events, upcoming_events_loading }}>
      {children}
    </indexEvents.Provider>
  );
};

export default IndexEvents;
