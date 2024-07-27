import React, { createContext, useState } from "react";

export const eventFormData = createContext(null);

const EventFormData = ({ children }) => {
  const [formData, setFormData] = useState("");
  return (
    <eventFormData.Provider value={{ formData, setFormData }}>
      {children}
    </eventFormData.Provider>
  );
};

export default EventFormData;
