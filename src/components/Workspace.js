import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";
import { useUserContext } from "../context/userContext";
import { useWorkspaceContext } from "../context/workspaceContext";
import axios from "axios";
import { BACKEND_URL } from "./constants";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Workspace = () => {
  const navigate = useNavigate();
  const { user, getAccessTokenSilently, logout } = useAuth0();
  const {
    userId,
    setUserId,
    setUserFirstName,
    setUserLastName,
    setUserEmail,
    setUsername,
  } = useUserContext();
  const { setWorkspaceId, setSelectedWorkspace } = useWorkspaceContext();
  const [workspace, setWorkspace] = useState();
  const [workspaceNumUsers, setWorkspaceNumUsers] = useState();
  const [workspaceList, setWorkspaceList] = useState();
  const [open, setOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  // const postUserBackend = async () => {
  //   const accessToken = await getAccessTokenSilently({});
  //   console.log("Posting to backend user data... " + user);

  //   const response = await axios.post(
  //     `${BACKEND_URL}/users`,
  //     {
  //       firstName: user.given_name,
  //       lastName: user.family_name,
  //       email: user.email,
  //       username: user.name,
  //     },
  //     { headers: { Authorization: `Bearer ${accessToken}` } }
  //   );
  //   setUserId(response.data.id);
  //   console.log("Backend user data updated.");
  //   setUserFirstName(user.given_name);
  //   setUserLastName(user.family_name);
  //   setUserEmail(user.email);
  //   setUsername(user.name);
  // };

  const getWorkspaceData = async () => {
    const accessToken = await getAccessTokenSilently({
      audience: process.env.REACT_APP_AUDIENCE,
      scope: process.env.REACT_APP_SCOPE,
    });

    const response = await axios.get(
      `${BACKEND_URL}/userWorkspaces/workspaces`,
      {
        params: { userId: userId },
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

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

    setWorkspaceNumUsers(responseNumArr);

    const workspaceListArr = [];

    for (let i = 0; i < response.data.length; i += 1) {
      const workspaceItem = {};
      workspaceItem["id"] = response.data[i].id;
      workspaceItem["name"] = response.data[i].name;
      workspaceItem["userCount"] = responseNumArr[i];
      workspaceListArr.push(workspaceItem);
    }

    setWorkspaceList(workspaceListArr);
  };

  useEffect(() => {
    // To implement if refactor Login.js. However, current method does update backend on the user's data.
    // postUserBackend();
    if (userId) {
      getWorkspaceData();
    }
  }, []);

  const handleClick = (e) => {
    setWorkspaceId(e.target.id);
    setSelectedWorkspace(e.target.name);
    navigate("/");
  };

  const handleClickLogout = () => {
    logout();
    navigate("/login");
  };

  const createNewWorkspace = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    // to add in backend routing for creating new workspace with user
    // navigate("/workspace");
    e.preventdefault();
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
        <button onClick={handleClickLogout}>Logout</button>
        <div>Workspaces for {user.email}</div>
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
              <button
                onClick={handleClick}
                id={workspace.id}
                name={workspace.name}
              >
                Launch Slack
              </button>
            </div>
          ))}
        </>
      </div>
      <button onClick={createNewWorkspace}>Create a new Workspace</button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create a new workspace
          </Typography>
          <form onSubmit={handleSubmit}>
            <label>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                New workspace name:
              </Typography>
              <input
                name="workspace-name"
                type="text"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
              />
            </label>
            <input type="submit" value="Create Workspace" />
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Workspace;
