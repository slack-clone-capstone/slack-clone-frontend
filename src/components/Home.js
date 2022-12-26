import React from "react";
import { useUserContext } from "../context/userContext";
import { useWorkspaceContext } from "../context/workspaceContext";
import Header from "./common/Header";
import Sidebar from "./common/Sidebar";
import Body from "./common/Body";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "./constants";

const socket = io.connect("http://localhost:3002", {
  transports: ["websocket"],
});

const Home = () => {
  const { userId, setUserId } = useUserContext();
  const { workspaceId, setWorkspaceId } = useWorkspaceContext();

  //Room State
  const [room, setRoom] = useState("");
  // Messages States
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });
  }, [socket]);

  return (
    <div>
      <Header setUserId={setUserId} setWorkspaceId={setWorkspaceId} />
      <div className="Home-content">
        <Sidebar className="Sidebar-content" />
        <Body className="Body-content" />
      </div>
      <div>
        <input
          placeholder="Room Number..."
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        />
        <button onClick={joinRoom}> Join Room</button>
        <input
          placeholder="Message..."
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
        <button onClick={sendMessage}> Send Message</button>
        <h1> Message:</h1>
        {messageReceived}
      </div>
    </div>
  );
};

export default Home;
