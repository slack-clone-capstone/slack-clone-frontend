import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserContext } from "../../context/userContext";
import { useWorkspaceContext } from "../../context/workspaceContext";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3002", {
  transports: ["websocket"],
});

const Body = () => {
  const { workspaceId, selectedWorkspace, selectedChat, selectedChatId } =
    useWorkspaceContext();

  // Messages States
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  const joinRoom = () => {
    if (selectedChatId !== "") {
      socket.emit("join_room", selectedChatId);
      console.log("test");
    }
  };

  const sendMessage = () => {
    console.log(message);
    socket.emit("send_message", { message, selectedChatId });
  };

  useEffect(() => {
    joinRoom();
  }, [selectedChat, selectedChatId]);

  //to troubleshoot why the messages not displaying
  useEffect(() => {
    console.log("socketon");
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessageReceived(data.message);
    });
  }, [socket]);

  return (
    <div className="Body">
      <div>{selectedChat}</div>
      <div>
        <h1>
          {" "}
          Messages:
          {messageReceived}
        </h1>
        <input
          placeholder="Message..."
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />

        <button onClick={sendMessage}> Send Message</button>
      </div>
    </div>
  );
};

export default Body;
