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
  const { workspaceId, setWorkspaceId } = useWorkspaceContext();

  return (
    <div>
      <Header setUserId={setUserId} setWorkspaceId={setWorkspaceId} />
      <div className="Home-content">
        <Sidebar className="Sidebar-content" />
        <Body className="Body-content" />
      </div>
    </div>
  );
};

export default Home;
