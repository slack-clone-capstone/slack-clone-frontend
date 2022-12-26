import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";
import { useUserContext } from "../context/userContext";
import { useWorkspaceContext } from "../context/workspaceContext";
import LoggedInLayout from "../navigation/LoggedInLayout";
import LoggedOutLayout from "../navigation/LoggedOutLayout";
import Workspace from "./Workspace";
import Home from "./Home";
import Login from "./Login";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route element={<LoggedOutLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<LoggedInLayout />}>
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
