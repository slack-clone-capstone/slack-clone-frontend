import React, { useContext, useState } from "react";

// create context
const WorkspaceContext = React.createContext();

// provide context
const WorkspaceContextProvider = ({ children }) => {
  const [workspaceId, setWorkspaceId] = useState();
  const [selectedWorkspace, setSelectedWorkspace] = useState();
  const [selectedChat, setSelectedChat] = useState("");
  const [selectedChatId, setSelectedChatId] = useState("");
  const value = {
    workspaceId,
    setWorkspaceId,
    selectedWorkspace,
    setSelectedWorkspace,
    selectedChat,
    setSelectedChat,
    selectedChatId,
    setSelectedChatId,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

// user context
const useWorkspaceContext = () => {
  const context = useContext(WorkspaceContext);

  if (context === undefined) {
    throw new Error(
      "useUserContext must be used within WorkspaceContextProvider"
    );
  }
  return context;
};

export { WorkspaceContextProvider, useWorkspaceContext };
