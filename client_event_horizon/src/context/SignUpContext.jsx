import { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const signUpContext = createContext(null);

const SignUpContext = ({ children }) => {
  const [stepCount, setStepCount] = useState(1);

  const [responseData, setResponseData] = useState("");

  return (
    <signUpContext.Provider
      value={{
        stepCount,
        setStepCount,
        responseData,
        setResponseData,
      }}
    >
      {children}
    </signUpContext.Provider>
  );
};

export default SignUpContext;
