import React from "react";
import { useUserContext } from "../context/userContext";
import { useWorkspaceContext } from "../context/workspaceContext";
import Header from "./common/Header";
import Sidebar from "./common/Sidebar";
import Body from "./common/Body";

const Home = () => {
  const { userId, setUserId } = useUserContext();
  const { workspaceId, setWorkspaceId } = useWorkspaceContext();

  return (
    <div>
      <Header setUserId={setUserId} setWorkspaceId={setWorkspaceId} />
      <div>
        <Sidebar />
        <Body />
      </div>
    </div>
  );
};

export default Home;
