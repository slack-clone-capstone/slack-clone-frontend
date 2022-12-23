import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { createPath, useNavigate } from "react-router";
import { useUserContext } from "../../context/userContext";
import { useWorkspaceContext } from "../../context/workspaceContext";
import axios from "axios";
import { BACKEND_URL } from "../constants";

const Sidebar = () => {
  // const { user, getAccessTokenSilently } = useAuth0();
  const { userId } = useUserContext();
  const { workspaceId, setWorkspaceId } = useWorkspaceContext();
  const [chats, setChats] = useState();
  const [chatsList, setChatsList] = useState();

  useEffect(() => {
    const getChats = async () => {
      // const accessToken = await getAccessTokenSilently({
      //   audience: process.env.REACT_APP_AUDIENCE,
      //   scope: process.env.REACT_APP_SCOPE,
      // });

      // const response = await axios.get(
      //   `${BACKEND_URL}/chats/`,
      //   {
      //     params: { userId: userId },
      //     headers: { Authorization: `Bearer ${accessToken}` },
      //   }
      // );
      // setChats(response.data);

      // const responseNumArr = [];

      const chatsListArr = [];

      // for (let i = 0; i < response.data.length; i += 1) {
      //   const chatItem = {};
      //   chatItem["id"] = response.data[i].id;
      //   chatItem["type"] = response.data[i].type;
      //   chatItem["channelName"] = response.data[i].channel_name;
      //   chatItem["channelDescription"] = response.data[i].channel_description;
      //   chatItem["channelPrivate"] = response.data[i].channel_private;
      //   chatsListArr.push(chatItem);
      // }

      setChatsList(chatsListArr);
    };

    if (userId) {
      getChats();
    }
  }, []);

  const handleClick = (e) => {
    // to edit to display messages from chat.
    // setWorkspaceId(e.target.id);
    // navigate("/");
  };

  return (
    <div className="Sidebar">
      {/* to integrate with MUI for user to toggle to other workspaces:
      https://mui.com/material-ui/react-select/#native-select */}
      <div>{workspaceId}</div>
      {chatsList?.map((chat, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <button onClick={handleClick} id={chat.id}>
            {chat.channelName}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
