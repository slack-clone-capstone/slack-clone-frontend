import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { createPath, useNavigate } from "react-router";
import { useUserContext } from "../context/userContext";
import { useWorkspaceContext } from "../context/workspaceContext";
import axios from "axios";
import { BACKEND_URL } from "./constants";

const Workspace = () => {
  const navigate = useNavigate();
  // const { user, getAccessTokenSilently } = useAuth0();
  const { userId } = useUserContext();
  const { setWorkspaceId } = useWorkspaceContext();
  const [workspace, setWorkspace] = useState();
  const [workspaceNumUsers, setWorkspaceNumUsers] = useState();
  const [workspaceList, setWorkspaceList] = useState();

  useEffect(() => {
    const getWorkspaceData = async () => {
      // const accessToken = await getAccessTokenSilently({
      //   audience: process.env.REACT_APP_AUDIENCE,
      //   scope: process.env.REACT_APP_SCOPE,
      // });

      // const response = await axios.get(
      //   `${BACKEND_URL}/userWorkspaces/workspaces`,
      //   {
      //     params: { userId: userId },
      //     headers: { Authorization: `Bearer ${accessToken}` },
      //   }
      // );
      // setWorkspace(response.data);

      // const responseNumArr = [];

      // for (let i = 0; i < response.data.length; i += 1) {
      //   const responseNum = await axios.get(
      //     `${BACKEND_URL}/userWorkspaces/users`,
      //     {
      //       params: { workspaceId: response.data[i].id },
      //       headers: { Authorization: `Bearer ${accessToken}` },
      //     }
      //   );
      //   responseNumArr.push(responseNum.data[0].count);
      // }

      // setWorkspaceNumUsers(responseNumArr);

      const workspaceListArr = [];

      // for (let i = 0; i < response.data.length; i += 1) {
      //   const workspaceItem = {};
      //   workspaceItem["id"] = response.data[i].id;
      //   workspaceItem["name"] = response.data[i].name;
      //   workspaceItem["userCount"] = responseNumArr[i];
      //   workspaceListArr.push(workspaceItem);
      // }

      setWorkspaceList(workspaceListArr);
    };

    if (userId) {
      getWorkspaceData();
    }
  }, []);

  const handleClick = (e) => {
    setWorkspaceId(e.target.id);
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div>Welcome Back</div>
      <div className="row">
        {/* <div>Workspaces for {user.email}</div> */}
        <>
          {workspaceList?.map((workspace, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div>
                <div>{workspace.name}</div>
                <div>{workspace.userCount} members</div>
              </div>
              <button onClick={handleClick} id={workspace.id}>
                Launch Slack
              </button>
            </div>
          ))}
        </>
      </div>
    </div>
  );
};

export default Workspace;
