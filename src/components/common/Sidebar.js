import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserContext } from "../../context/userContext";
import { useWorkspaceContext } from "../../context/workspaceContext";
import axios from "axios";
import { BACKEND_URL } from "../constants";

const Sidebar = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const { userId } = useUserContext();
  const { workspaceId, selectedWorkspace, setSelectedChat, setSelectedChatId } =
    useWorkspaceContext();
  const [chats, setChats] = useState();
  const [chatsList, setChatsList] = useState();

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

  useEffect(() => {
    if (userId) {
      getChats();
    }
  }, []);

  const handleClick = (e) => {
    setSelectedChat(e.target.name);
    setSelectedChatId(e.target.id);
  };

  return (
    <div className="Sidebar">
      {/* to integrate with MUI for user to toggle to other workspaces:
      https://mui.com/material-ui/react-select/#native-select */}
      <div>{selectedWorkspace} Workspace</div>
      {chatsList?.map((chat, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <button onClick={handleClick} id={chat.id} name={chat.channelName}>
            {chat.channelName}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
