import { collection, query, limit } from "firebase/firestore";
import { createContext, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { fireDB } from "../firebase/firbaseConfig";
import { useEffect } from "react";

export const categoriesContext = createContext(null);

const CategoriesContext = ({ children }) => {
  const [categories, categories_loading, categories_error] = useCollection(
    collection(fireDB, "categories")
  );

  const [isOpen, setIsOpen] = useState(false);

  const [state, setState] = useState({
    technical: false,
    workshops: false,
    sports: false,
    seminar: false,
    cultural: false,
  });

  const [filter, setFilter] = useState([]);

  return (
    <>
      <categoriesContext.Provider
        value={{
          categories,
          categories_loading,
          categories_error,
          isOpen,
          setIsOpen,
          state,
          setState,
          filter,
          setFilter,
        }}
      >
        {children}
      </categoriesContext.Provider>
    </>
  );
};

export default CategoriesContext;
