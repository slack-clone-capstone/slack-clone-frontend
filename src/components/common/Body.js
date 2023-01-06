import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserContext } from "../../context/userContext";
import { useWorkspaceContext } from "../../context/workspaceContext";
import Message from "./Message";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import io from "socket.io-client";
import SendIcon from "@mui/icons-material/Send";

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
  const [sortedMessagesList, setSortedMessagesList] = useState();
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
    // console.log(messagesList[1]);

    // sorting message data // it is already sorted when pulled out from database
    let sortedMessageItemArr = [];

    for (let i = 0; i < messageItemArr.length; i += 1) {
      // different classes - msg-with-date, msg-with-dp, msg-only

      if (i == 0) {
        messageItemArr[i]["classNameTag"] = "msg-with-date";
      } else {
        if (
          messageItemArr[i].date.split("T")[0] !=
          messageItemArr[i - 1].date.split("T")[0]
        ) {
          messageItemArr[i]["classNameTag"] = "msg-with-date";
        } else if (
          messageItemArr[i].date.split("T")[0] ==
            messageItemArr[i - 1].date.split("T")[0] &&
          messageItemArr[i].userId != messageItemArr[i - 1].userId
        ) {
          messageItemArr[i]["classNameTag"] = "msg-with-dp";
        } else {
          messageItemArr[i]["classNameTag"] = "msg-only";
        }
      }
      sortedMessageItemArr.push(messageItemArr[i]);
    }

    setSortedMessagesList(sortedMessageItemArr);
    console.log(sortedMessageItemArr);
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
      <div className="Body-message">
        {sortedMessagesList?.map((messageItem, index) => (
          <div key={index}>
            <Message
              date={messageItem.date}
              text={messageItem.text}
              abbreviatedName={messageItem.abbreviatedName}
              username={messageItem.username}
              classNameTag={messageItem.classNameTag}
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
              classNameTag="msg-with-dp"
            />
          </div>
        ))}
        <div className="Message-input-box">
          <textarea
            type="input"
            className="Message-input"
            placeholder="Message..."
            onChange={(event) => {
              setMessageTyped(event.target.value);
            }}
          />
          <button onClick={sendMessage}>
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Body;
