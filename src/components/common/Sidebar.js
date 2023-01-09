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
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";

const Sidebar = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const { userId } = useUserContext();
  const {
    workspaceId,
    selectedWorkspace,
    setSelectedChat,
    setSelectedChatId,
    usersList,
    selectedChatId,
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

  // refactoring
  const getChats = async () => {
    const accessToken = await getAccessTokenSilently({
      audience: process.env.REACT_APP_AUDIENCE,
      scope: process.env.REACT_APP_SCOPE,
    });

    const response = await axios.get(`${BACKEND_URL}/chats/`, {
      params: { userId: userId, workspaceId: workspaceId },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    setChats(response.data);

    console.log("Chats retrieved for " + user.given_name);
    console.log(response.data);

    // for each chat, if it is a direct message, to retrieve usernames
    response.data.forEach(async (response) => {
      console.log(response.type);

      let directMessageName = "";

      if (response.type == "direct message") {
        response.chat_users.forEach(async (userId) => {
          const userData = await axios.get(`${BACKEND_URL}/users/${userId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const userNameToDisplay = `${userData.data.first_name} ${userData.data.last_name}`;

          if (directMessageName.length === 0) {
            directMessageName = userNameToDisplay;
          } else {
            directMessageName += `, ${userNameToDisplay}`;
          }
        });
      }
      response["usersInDM"] = directMessageName;
    });

    // to change response data from snake_case to camelCase
    let chatsListArr = [];
    response.data.forEach((chat) => {
      let chatItem = {};
      chatItem["id"] = chat.id;
      chatItem["channelName"] = chat.channel_name;
      chatItem["channelDescription"] = chat.channel_description;
      chatItem["type"] = chat.type;
      chatItem["workspaceId"] = chat.workspace_id;
      chatItem["chatUsers"] = chat.chat_users;
      chatItem["numUnreadMessages"] = chat.num_unread_messages;
      chatItem["hasUnreadMessages"] = chat.has_unread_messages;
      chatsListArr.push(chatItem);
    });

    console.log(chatsListArr);
    setChatsList(chatsListArr);
  };

  const createNewChat = async () => {
    const accessToken = await getAccessTokenSilently({});

    const response = await axios.post(
      `${BACKEND_URL}/chats/`,
      {
        userId: userId,
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

  // so that side bar will rerender and unread messages bubble disappears
  useEffect(() => {
    console.log("selected another chat");
    // getChats();
  }, [selectedChatId]);

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

  const createNewDM = async () => {
    const accessToken = await getAccessTokenSilently({});

    const response = await axios.post(
      `${BACKEND_URL}/chats/`,
      {
        userId: userId,
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

  const submitNewDM = (e) => {
    e.preventDefault();
    createNewDM();
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
                      className={
                        chat.hasUnreadMessages
                          ? `Sidebar-chat-item Sidebar-chat-item-bold`
                          : `Sidebar-chat-item`
                      }
                      onClick={handleClick}
                      id={chat.id}
                      name={chat.channelName}
                    >
                      <div className="Sidebar-channel-icon-and-name">
                        <div
                          className="not-clickable"
                          style={{ paddingRight: "0.5rem" }}
                        >
                          {chat.channelPrivate ? <LockIcon /> : <Grid3x3Icon />}
                        </div>
                        <div className="Sidebar-overflow not-clickable">
                          {chat.channelName}
                        </div>
                      </div>
                      <div className="Sidebar-unread-message-bubble not-clickable">
                        {chat.hasUnreadMessages && chat.numUnreadMessages}
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
                      className={
                        chat.hasUnreadMessages
                          ? `Sidebar-chat-item Sidebar-chat-item-bold `
                          : `Sidebar-chat-item `
                      }
                      onClick={handleClick}
                      id={chat.id}
                      name={chat.channelName}
                      name={chat.usersInDM}
                    >
                      <div className="Sidebar-channel-icon-and-name">
                        <div
                          className="not-clickable"
                          style={{ paddingRight: "0.5rem" }}
                        >
                          <PeopleAltRoundedIcon />
                        </div>
                        <div className="Sidebar-overflow not-clickable">
                          {chat.channelName}
                          {chat.usersInDM}
                        </div>
                      </div>
                      <div className="Sidebar-unread-message-bubble not-clickable">
                        {chat.hasUnreadMessages && chat.numUnreadMessages}
                      </div>
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
