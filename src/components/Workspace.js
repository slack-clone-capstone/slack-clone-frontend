import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";
import { useUserContext } from "../context/userContext";
import { useWorkspaceContext } from "../context/workspaceContext";
import axios from "axios";
import { BACKEND_URL } from "./constants";

const Workspace = () => {
  const navigate = useNavigate();
  const { user, getAccessTokenSilently } = useAuth0();
  const { userId } = useUserContext();
  const { setWorkspaceId } = useWorkspaceContext();
  const [workspace, setWorkspace] = useState();
  const [workspaceNumUsers, setWorkspaceNumUsers] = useState();
  const [workspaceList, setWorkspaceList] = useState();

  useEffect(() => {
    // setUserId(1);
    console.log(userId);

    const getWorkspaceData = async () => {
      const accessToken = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUDIENCE,
        scope: process.env.REACT_APP_SCOPE,
      });

      console.log(accessToken);

      const response = await axios.get(
        `${BACKEND_URL}/userWorkspaces/workspaces`,
        {
          params: { userId: userId },
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      console.log(response);
      setWorkspace(response.data);

      const responseNumArr = [];

      for (let i = 0; i < response.data.length; i += 1) {
        const responseNum = await axios.get(
          `${BACKEND_URL}/userWorkspaces/users`,
          {
            params: { workspaceId: response.data[i].id },
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        responseNumArr.push(responseNum.data[0].count);
      }
      console.log(responseNumArr);

      setWorkspaceNumUsers(responseNumArr);

      const workspaceListArr = [];

      for (let i = 0; i < response.data.length; i += 1) {
        const workspaceItem = {};
        workspaceItem["name"] = response.data[i].name;
        workspaceItem["userCount"] = responseNumArr[i];
        workspaceListArr.push(workspaceItem);
      }

      console.log(workspaceListArr);
      setWorkspaceList(workspaceListArr);
    };

    if (userId) {
      getWorkspaceData();
    }

    console.log(workspace, workspaceNumUsers, workspaceList);
  }, []);

  const handleClick = (e) => {
    console.log(e.target.id);
    setWorkspaceId(e.target.id); // TBC

    navigate("/");
  };

  return (
    <>
      <div>Welcome Back</div>
      <div>Workspaces for {user.email}</div>
      <div>
        {workspaceList?.map((workspace, index) => (
          <button
            onClick={handleClick}
            key={index}
            id={index}
            style={{ display: "block" }}
          >
            <div>{workspace.name}</div>
            <div>{workspace.userCount} members</div>
          </button>
        ))}
      </div>
    </>
  );
};

export default Workspace;
