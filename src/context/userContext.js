import React, { useContext, useState } from "react";

// create context
const UserContext = React.createContext();

// provide context
const UserContextProvider = ({ children }) => {
  const [userId, setUserId] = useState();
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userUsername, setUsername] = useState("");
  const value = {
    userId,
    setUserId,
    userFirstName,
    setUserFirstName,
    userLastName,
    setUserLastName,
    userEmail,
    setUserEmail,
    userUsername,
    setUsername,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// user context
const useUserContext = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUserContext must be used within UserContextProvider");
  }
  return context;
};

export { UserContextProvider, useUserContext };
