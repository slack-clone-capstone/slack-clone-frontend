import React, { useEffect, useReducer, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserContext } from "../../context/userContext";
import { useWorkspaceContext } from "../../context/workspaceContext";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import NewDmModal from "./NewDmModal";
import NewChannelModal from "./NewChannelModal";
import LockIcon from "@mui/icons-material/Lock";
import Grid3x3Icon from "@mui/icons-material/Grid3x3";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

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
  const [dMCollapsed, setDMCollapsed] = useState(false);
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
    console.log(e.target);
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
    console.log(e.target.checked);
    if (e.target.checked === true && !selectedUserIds.includes(e.target.id)) {
      console.log("case 1");
      setSelectedUserIds([...selectedUserIds, e.target.id]);
    }
    if (e.target.checked === false && selectedUserIds.includes(e.target.id)) {
      let cloneSelectedUserIds = [...selectedUserIds];
      let indexForDeletion = selectedUserIds.indexOf(e.target.id);
      if (indexForDeletion === 0 && cloneSelectedUserIds.length === 1) {
        setSelectedUserIds([]);
        console.log("case 2");
      } else {
        cloneSelectedUserIds.splice(indexForDeletion, 1);
        setSelectedUserIds(cloneSelectedUserIds);
        console.log("case 3");
      }
    }
    console.log(selectedUserIds);
  };

  const handleDMClose = () => {
    setDMOpen(false);
  };

  const submitNewDM = (e) => {
    e.preventDefault();
    if (selectedUserIds.length !== 0) {
      createNewDM();
    }
  };

  const handleClickCollapsible = (e) => {
    switch (e.target.id) {
      case "toggleChannelCollapseBtn":
        setChannelCollapsed(!channelCollapsed);
      case "toggleDMCollapseBtn":
        setDMCollapsed(!dMCollapsed);
    }
  };

  const submitNewChannel = (e) => {
    e.preventDefault();
    createNewChat();
  };

  return (
    <>
      <div className="Sidebar-Body-header">{selectedWorkspace}</div>
      <div className="Sidebar-content">
        <div className="Sidebar-chats">
          <div className="Sidebar-chat-header">
            <div className="Sidebar-chat-header-div">
              <button
                onClick={handleClickCollapsible}
                className="button button-hover"
              >
                {channelCollapsed ? (
                  <ArrowRightIcon id="toggleChannelCollapseBtn" />
                ) : (
                  <ArrowDropDownIcon id="toggleChannelCollapseBtn" />
                )}
              </button>
              <div>Channels</div>
            </div>
            <div>
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
                      className="Sidebar-chat-item not-clickable Sidebar-overflow "
                      onClick={handleClick}
                      id={chat.id}
                      name={chat.channelName}
                      style={{ paddingRight: "0.5rem" }}
                    >
                      {chat.channelPrivate ? <LockIcon /> : <Grid3x3Icon />}{" "}
                      &nbsp;
                      {chat.channelName}
                    </button>
                  </div>
                )
            )}
          </div>

          <div className="Sidebar-chat-header">
            <div className="Sidebar-chat-header-div">
              <button
                className="button button-hover"
                onClick={handleClickCollapsible}
              >
                {dMCollapsed ? (
                  <ArrowRightIcon id="toggleDMCollapseBtn" />
                ) : (
                  <ArrowDropDownIcon id="toggleDMCollapseBtn" />
                )}
              </button>
              <div>Direct Messages</div>
            </div>
            <div>
              <button
                className="Sidebar-new-chat button button-hover"
                onClick={newDMModal}
              >
                +
              </button>
            </div>
          </div>
          <div style={{ display: dMCollapsed ? "none" : "block" }}>
            {chatsList?.map(
              (chat, index) =>
                chat.type === "direct message" && (
                  <div key={index}>
                    <button
                      className="Sidebar-chat-item Sidebar-overflow"
                      onClick={handleClick}
                      id={chat.id}
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

      {/* for Modals */}
      <NewChannelModal
        channelOpen={channelOpen}
        handleClose={handleClose}
        submitNewChannel={submitNewChannel}
        newChannelName={newChannelName}
        setNewChannelName={setNewChannelName}
        newChannelDescription={newChannelDescription}
        setNewChannelDescription={setNewChannelDescription}
        newChannelPrivate={newChannelPrivate}
        editChannelPrivate={editChannelPrivate}
      />
      <NewDmModal
        dMOpen={dMOpen}
        handleDMClose={handleDMClose}
        submitNewDM={submitNewDM}
        usersList={usersList}
        updateChecks={updateChecks}
      />
    </>
  );
};

export default Sidebar;
