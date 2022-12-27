import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserContext } from "../../context/userContext";
import { useWorkspaceContext } from "../../context/workspaceContext";
import Message from "./Message";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3002", {
  transports: ["websocket"],
});

const Body = () => {
  const { selectedChat, selectedChatId } = useWorkspaceContext();
  const { userId, userUsername, userFirstName, userLastName } =
    useUserContext();
  const { getAccessTokenSilently } = useAuth0();

  // Messages States
  const [messagesList, setMessagesList] = useState();
  const [messageTyped, setMessageTyped] = useState("");
  const [messageReceived, setMessageReceived] = useState([]);
  // const [nameAbbreviation, setNameAbbreviation] = useState("");

  const getMessageData = async () => {
    const accessToken = await getAccessTokenSilently({});
    const response = await axios.get(
      `${BACKEND_URL}/messages/${selectedChatId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    console.log(response.data);

    const messageItemArr = [];

    for (let i = 0; i < response.data.length; i += 1) {
      const userResponse = await axios.get(
        `${BACKEND_URL}/users/${response.data[i].userId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const abbreviatedName =
        userResponse.data.first_name.charAt(0) +
        userResponse.data.last_name.charAt(0);
      const messageItem = {};
      messageItem["id"] = response.data[i].id;
      messageItem["userId"] = response.data[i].userId;
      messageItem["date"] = response.data[i].date;
      messageItem["text"] = response.data[i].text;
      messageItem["abbreviatedName"] = abbreviatedName;
      messageItem["username"] = userResponse.data.username;
      messageItemArr.push(messageItem);
    }

    setMessagesList(messageItemArr);
    console.log(messagesList[1]);
  };

  const joinRoom = () => {
    if (selectedChatId !== "") {
      socket.emit("join_room", selectedChatId);
      console.log(userUsername + " entered " + selectedChat);
      getMessageData();
      setMessageReceived([]);
    }
  };

  const sendMessage = async () => {
    console.log(messageTyped);
    const messageToPost = {
      chatId: selectedChatId,
      userId: userId,
      text: messageTyped,
      date: new Date(),
      is_edited: "FALSE",
    };

    const accessToken = await getAccessTokenSilently({});
    await axios.post(`${BACKEND_URL}/messages/`, messageToPost, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const abbreviatedName = userFirstName.charAt(0) + userLastName.charAt(0);
    const messageToEmit = {
      chatId: selectedChatId,
      userId: userId,
      text: messageTyped,
      date: new Date(),
      is_edited: "FALSE",
      abbreviatedName: abbreviatedName,
      username: userUsername,
    };
    await socket.emit("send_message", messageToEmit);
  };

  useEffect(() => {
    joinRoom();
  }, [selectedChat, selectedChatId]);

  useEffect(() => {
    console.log("socketon");
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessageReceived((message) => [...message, data]);
    });
  }, [socket]);

  return (
    <div className="Body-content">
      <h2 className="Body-channel-header">{selectedChat}</h2>
      {messagesList?.map((messageItem, index) => (
        <div key={index}>
          <Message
            date={messageItem.date}
            text={messageItem.text}
            abbreviatedName={messageItem.abbreviatedName}
            username={messageItem.username}
          />
        </div>
      ))}
      {messageReceived?.map((messageItem, index) => (
        <div key={index}>
          <Message
            date={messageItem.date}
            text={messageItem.text}
            abbreviatedName={messageItem.abbreviatedName}
            username={messageItem.username}
          />
        </div>
      ))}
      <div>
        <input
          placeholder="Message..."
          onChange={(event) => {
            setMessageTyped(event.target.value);
          }}
        />

        <button onClick={sendMessage}> Send Message</button>
      </div>
    </div>
  );
};

export default Body;
