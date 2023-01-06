import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserContext } from "../../context/userContext";
import { useWorkspaceContext } from "../../context/workspaceContext";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Switch from "@mui/material/Switch";
import LockIcon from "@mui/icons-material/Lock";
import Grid3x3Icon from "@mui/icons-material/Grid3x3";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

// to truncate workspace name if it gets too long.
// function truncateString(str, num) {
//   if (str.length > num) {
//     return str.slice(0, num) + "...";
//   } else {
//     return str;
//   }
// }

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

const Sidebar = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const { userId } = useUserContext();
  const { workspaceId, selectedWorkspace, setSelectedChat, setSelectedChatId } =
    useWorkspaceContext();
  const [chats, setChats] = useState();
  const [chatsList, setChatsList] = useState();
  const [open, setOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDescription, setNewChannelDescription] = useState("");
  const [newChannelPrivate, setNewChannelPrivate] = useState(false);
  const [channelCollapsed, setChannelCollapsed] = useState(false);

  const getChats = async () => {
    const accessToken = await getAccessTokenSilently({
      audience: process.env.REACT_APP_AUDIENCE,
      scope: process.env.REACT_APP_SCOPE,
    });

    const response = await axios.get(`${BACKEND_URL}/chats/`, {
      // for testing purposes, userId = 1
      // params: { userId: userId, workspaceId: workspaceId },
      params: { userId: 1, workspaceId: workspaceId },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    setChats(response.data);
    console.log("Chats retrieved for " + user.given_name);

    const chatsListArr = [];

    for (let i = 0; i < response.data.length; i += 1) {
      const chatItem = {};
      chatItem["id"] = response.data[i].id;
      chatItem["type"] = response.data[i].type;
      chatItem["channelName"] = response.data[i].channel_name;
      chatItem["channelDescription"] = response.data[i].channel_description;
      chatItem["channelPrivate"] = response.data[i].channel_private;
      chatsListArr.push(chatItem);
    }

    setChatsList(chatsListArr);
  };

  const createNewChat = async () => {
    const accessToken = await getAccessTokenSilently({});

    const response = await axios.post(
      `${BACKEND_URL}/chats/`,
      {
        userId: 1,
        workspaceId: workspaceId,
        type: "channel",
        channelName: newChannelName,
        channelDescription: newChannelDescription,
        channelPrivate: newChannelPrivate,
      },
      // for testing purposes, userId = 1
      // params: { userId: userId, workspaceId: workspaceId },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    console.log(`${newChannelName} created`);

    setNewChannelName("");
    setNewChannelDescription("");
    setNewChannelPrivate(false);
    setOpen(false);
  };

  useEffect(() => {
    if (userId) {
      getChats();
    }
  }, [open]);

  const handleClick = (e) => {
    setSelectedChat(e.target.name);
    setSelectedChatId(e.target.id);
  };

  const newChannelModal = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const editChannelPrivate = () => {
    setNewChannelPrivate(!newChannelPrivate);
  };

  const submitNewChannel = (e) => {
    e.preventDefault();
    createNewChat();
  };

  const handleChannelCollapseClick = (e) => {
    setChannelCollapsed(!channelCollapsed);
    console.log(channelCollapsed);
  };

  return (
    <div className="Sidebar-content">
      {/* to integrate with MUI for user to toggle to other workspaces:
      https://mui.com/material-ui/react-select/#native-select */}

      <div className="Sidebar-chats">
        <div className="Sidebar-chat-header">
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={handleChannelCollapseClick}
              className="button button-hover"
            >
              {channelCollapsed ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
            </button>
            <div>Channels</div>
          </div>
          <div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography variant="h6" component="h2">
                  Create a channel
                </Typography>
                <form onSubmit={submitNewChannel}>
                  <label>
                    <Typography sx={{ mt: 2 }}>New channel name:</Typography>
                    <input
                      name="channel-name"
                      type="text"
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                    />
                  </label>
                  <label>
                    <Typography sx={{ mt: 2 }}>Description:</Typography>
                    <input
                      name="channel-description"
                      type="text"
                      value={newChannelDescription}
                      onChange={(e) => setNewChannelDescription(e.target.value)}
                    />
                  </label>
                  <label>
                    <Typography sx={{ mt: 2 }}>Make private?</Typography>
                    <Switch
                      checked={newChannelPrivate}
                      onChange={editChannelPrivate}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  </label>
                  <br />
                  <input type="submit" value="Create channel" />
                </form>
              </Box>
            </Modal>
            <button
              className="Sidebar-new-chat button button-hover"
              onClick={newChannelModal}
              style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
            >
              +
            </button>
          </div>
        </div>
        <div style={{ display: channelCollapsed ? "none" : "block" }}>
          {chatsList?.map(
            (chat, index) =>
              chat.type === "channel" && (
                <div key={index} style={{}}>
                  <button
                    className="Sidebar-chat-item"
                    onClick={handleClick}
                    id={chat.id}
                    name={chat.channelName}
                  >
                    <div style={{ paddingRight: "0.5rem" }}>
                      {chat.channelPrivate ? <LockIcon /> : <Grid3x3Icon />}
                    </div>
                    <div>{chat.channelName}</div>
                  </button>
                </div>
              )
          )}
        </div>

        <div className="Sidebar-chat-header">
          <div style={{ display: "flex", alignItems: "center" }}>
            <button>
              <ArrowDropDownIcon />
            </button>
            <div>Direct Messages</div>
          </div>
        </div>
        {chatsList?.map(
          (chat, index) =>
            chat.type === "direct message" && (
              <div key={index} style={{}}>
                <button
                  onClick={handleClick}
                  id={chat.id}
                  name={chat.channelName}
                >
                  {chat.channelName}
                </button>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default Sidebar;
