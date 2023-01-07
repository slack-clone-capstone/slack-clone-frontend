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
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const Sidebar = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const { userId } = useUserContext();
  const {
    workspaceId,
    selectedWorkspace,
    setSelectedChat,
    setSelectedChatId,
    usersList,
  } = useWorkspaceContext();
  const [chats, setChats] = useState();
  const [chatsList, setChatsList] = useState();
  const [channelOpen, setChannelOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDescription, setNewChannelDescription] = useState("");
  const [newChannelPrivate, setNewChannelPrivate] = useState(false);
  const [channelCollapsed, setChannelCollapsed] = useState(false);
  const [dmCollapsed, setDmCollapsed] = useState(false);
  const [dMOpen, setDMOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const getChats = async () => {
    const accessToken = await getAccessTokenSilently({
      audience: process.env.REACT_APP_AUDIENCE,
      scope: process.env.REACT_APP_SCOPE,
    });

    const response = await axios.get(`${BACKEND_URL}/chats/`, {
      // for testing purposes, userId = 1
      // params: { userId: userId, workspaceId: workspaceId },
      params: { userId: 4, workspaceId: workspaceId },
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

      // if the chat is a Direct Message
      if (response.data[i].type === "direct message") {
        const chatIdToQuery = response.data[i].id;
        const responseOfUsers = await axios.get(
          `${BACKEND_URL}/chats/users/${chatIdToQuery}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        let directMessageName = "";
        for (let j = 0; j < responseOfUsers.data.length; j += 1) {
          const userIdInfo = responseOfUsers.data[j].userId;
          const userResponse = await axios.get(
            `${BACKEND_URL}/users/${userIdInfo}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          const userNameToDisplay =
            userResponse.data.first_name + " " + userResponse.data.last_name;
          if (directMessageName.length === 0) {
            directMessageName = userNameToDisplay;
          } else {
            directMessageName += `, ${userNameToDisplay}`;
          }
        }
        chatItem["usersInDM"] = directMessageName;
      }

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
        othersUserId: null,
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
    setChannelOpen(false);
  };

  useEffect(() => {
    if (userId) {
      getChats();
    }
  }, [channelOpen, dMOpen]);

  const handleClick = (e) => {
    setSelectedChat(e.target.name);
    setSelectedChatId(e.target.id);
  };

  const newChannelModal = () => {
    setChannelOpen(true);
  };

  const handleClose = () => {
    setChannelOpen(false);
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
  };

  const handleDmCollapseClick = (e) => {
    setDmCollapsed(!dmCollapsed);
  };

  const createNewDM = async () => {
    const accessToken = await getAccessTokenSilently({});

    const response = await axios.post(
      `${BACKEND_URL}/chats/`,
      {
        userId: 1,
        workspaceId: workspaceId,
        type: "direct message",
        channelName: null,
        channelDescription: null,
        channelPrivate: null,
        othersUserId: selectedUserIds,
      },
      // for testing purposes, userId = 1
      // params: { userId: userId, workspaceId: workspaceId },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    console.log("Direct message created");

    setSelectedUserIds([]);
    setDMOpen(false);
  };

  const newDMModal = () => {
    setDMOpen(true);
    setSelectedUserIds([]);
  };

  const updateChecks = (e) => {
    if (e.target.checked === true && !selectedUserIds.includes(+e.target.id)) {
      setSelectedUserIds([...selectedUserIds, e.target.id]);
    }
    if (e.target.checked === false && selectedUserIds.includes(+e.target.id)) {
      let cloneSelectedUserIds = [...selectedUserIds];
      let indexForDeletion = selectedUserIds.indexOf(+e.target.id);
      if (indexForDeletion === 0 && cloneSelectedUserIds.length === 1) {
        setSelectedUserIds([]);
      } else {
        cloneSelectedUserIds.splice(indexForDeletion, 1);
        setSelectedUserIds(cloneSelectedUserIds);
      }
    }
  };

  const handleDMClose = () => {
    setDMOpen(false);
  };

  // const editChannelPrivate = () => {
  //   setNewChannelPrivate(!newChannelPrivate);
  // };

  const submitNewDM = (e) => {
    e.preventDefault();
    createNewDM();
  };

  return (
    <>
      <div className="Sidebar-Body-header">{selectedWorkspace}</div>
      <div className="Sidebar-content">
        <div className="Sidebar-chats">
          <div className="Sidebar-chat-header">
            <div className="Sidebar-chat-header-div">
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
                open={channelOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box className="Modal-new-chat">
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
                        onChange={(e) =>
                          setNewChannelDescription(e.target.value)
                        }
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
              >
                +
              </button>
            </div>
          </div>
          <div style={{ display: channelCollapsed ? "none" : "block" }}>
            {chatsList?.map(
              (chat, index) =>
                chat.type === "channel" && (
                  <div key={index}>
                    <button
                      className="Sidebar-chat-item"
                      onClick={handleClick}
                      id={chat.id}
                      name={chat.channelName}
                    >
                      <div
                        className="not-clickable"
                        style={{ paddingRight: "0.5rem" }}
                      >
                        {chat.channelPrivate ? <LockIcon /> : <Grid3x3Icon />}
                      </div>
                      <div className="Sidebar-overflow not-clickable">
                        {chat.channelName}
                      </div>
                    </button>
                  </div>
                )
            )}
          </div>

          <div className="Sidebar-chat-header">
            <div className="Sidebar-chat-header-div">
              <button
                className="button button-hover"
                onClick={handleDmCollapseClick}
              >
                {dmCollapsed ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
              </button>
              <div>Direct Messages</div>
            </div>
            <div>
              <Modal
                open={dMOpen}
                onClose={handleDMClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box className="Modal-new-chat">
                  <Typography variant="h6" component="h2">
                    Add users to direct message:
                  </Typography>
                  <form onSubmit={submitNewDM}>
                    <FormGroup>
                      {usersList?.map((userItem, index) => (
                        <FormControlLabel
                          // className="twocolelement"
                          key={index}
                          control={
                            <Checkbox
                              onChange={updateChecks}
                              index={index}
                              id={userItem.id.toString()}
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          }
                          label={
                            userItem.firstName +
                            " " +
                            userItem.lastName +
                            " " +
                            userItem.username
                          }
                        />
                      ))}
                    </FormGroup>

                    <br />
                    <input type="submit" value="New conversation" />
                  </form>
                </Box>
              </Modal>
              <button
                className="Sidebar-new-chat button button-hover"
                onClick={newDMModal}
              >
                +
              </button>
            </div>
          </div>
          <div style={{ display: dmCollapsed ? "none" : "block" }}>
            {chatsList?.map(
              (chat, index) =>
                chat.type === "direct message" && (
                  <div key={index}>
                    <button
                      className="Sidebar-chat-item Sidebar-overflow"
                      onClick={handleClick}
                      id={chat.id}
                      name={chat.channelName}
                      name={chat.usersInDM}
                    >
                      {chat.channelName}
                      {chat.usersInDM}
                    </button>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
