import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserContext } from "../../context/userContext";
import { useWorkspaceContext } from "../../context/workspaceContext";
import Message from "./Message";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import io from "socket.io-client";
import SendIcon from "@mui/icons-material/Send";
import { textAlign } from "@mui/system";

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
  const [sortedMessagesDict, setSortedMessagesDict] = useState({});
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

    // sorting message data
    let messageListDict = {};

    for (let i = 0; i < messageItemArr.length; i += 1) {
      let newDate = new Date(messageItemArr[i].date);
      messageItemArr[i]["msgDate"] = newDate.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      messageItemArr[i]["msgTime"] = newDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      let currentMsgDate = messageItemArr[i]["msgDate"];
      let currentMsgTime = messageItemArr[i]["msgTime"];

      if (!(currentMsgDate in messageListDict)) {
        messageListDict[currentMsgDate] = [];
      }

      if (messageListDict[currentMsgDate].length >= 1) {
        let lastDate = new Date(
          messageListDict[currentMsgDate][
            messageListDict[currentMsgDate].length - 1
          ].date
        );

        // if between 2 dates, the timing is less than 10 minutes, then no need dp
        let diff = (newDate.getTime() - lastDate.getTime()) / 1000 / 60;

        if (
          diff <= 10 &&
          messageItemArr[i].userId ==
            messageListDict[currentMsgDate][
              messageListDict[currentMsgDate].length - 1
            ].userId
        ) {
          messageItemArr[i]["classNameTag"] = "msg-only";
        } else {
          messageItemArr[i]["classNameTag"] = "msg-with-dp";
        }
      } else {
        messageItemArr[i]["classNameTag"] = "msg-with-dp";
      }
      messageListDict[currentMsgDate].push(messageItemArr[i]);
    }

    setSortedMessagesDict(messageListDict);
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
    <>
      <div className="Sidebar-Body-header Sidebar-body-header-only">
        <div>{selectedChat}</div>
        <div> {selectedChat ? "members" : ""}</div>
      </div>
      <div className="Body-message-container">
        <div className="Body-message">
          {Object.entries(sortedMessagesDict)?.map((item) => {
            const [dateOnly, messageArr] = item;
            return (
              <div className="Message-block">
                <div className="Message-date">{dateOnly}</div>
                <div className="Message-block-2">
                  {messageArr?.map((messageItem, index) => (
                    <div key={index}>
                      <Message
                        date={messageItem.date}
                        msgDate={messageItem.msgDate}
                        msgTime={messageItem.msgTime}
                        text={messageItem.text}
                        abbreviatedName={messageItem.abbreviatedName}
                        username={messageItem.username}
                        classNameTag={messageItem.classNameTag}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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
        </div>
        {selectedChat && (
          <div className="Message-input-box">
            <textarea
              type="input"
              className="Message-input"
              placeholder="Message..."
              onChange={(event) => {
                setMessageTyped(event.target.value);
              }}
            />
            <button className="button2 button-hover" onClick={sendMessage}>
              <SendIcon />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Body;
