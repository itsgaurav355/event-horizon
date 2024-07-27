import { createContext, useState } from "react";

export const signUpContext = createContext(null);

const SignUpContext = ({ children }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stepCount, setStepCount] = useState(1);
  const [photoURL, setPhotoURL] = useState(" ");

  return (
    <signUpContext.Provider
      value={{
        email,
        password,
        stepCount,
        setEmail,
        setPassword,
        setStepCount,
        photoURL,
        setPhotoURL,
      }}
    >
      {children}
    </signUpContext.Provider>
  );
};

export default SignUpContext;
