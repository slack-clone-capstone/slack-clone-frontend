import React from "react";
import { useUserContext } from "../context/userContext";
import { useWorkspaceContext } from "../context/workspaceContext";
import Header from "./common/Header";
import Sidebar from "./common/Sidebar";
import Body from "./common/Body";

import { useEffect, useState } from "react";
import { BACKEND_URL } from "./constants";

const Home = () => {
  const { userId, setUserId } = useUserContext();
  const { workspaceId, setWorkspaceId, selectedWorkspace, selectedChat } =
    useWorkspaceContext();

  return (
    <div>
      <Header setUserId={setUserId} setWorkspaceId={setWorkspaceId} />
      <div className="Home-content">
        <div className="Sidebar">
          <div className="Home-header">{selectedWorkspace}</div>
          <Sidebar />
        </div>
        <div className="Body">
          <div className="Home-header">{selectedChat}</div>
          <Body className="scrollbar" />
        </div>
      </div>
    </div>
  );
};

export default Home;
