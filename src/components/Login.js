import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserContext } from "../context/userContext";
import { useNavigate } from "react-router";
import { BACKEND_URL } from "./constants";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { userId, setUserId } = useUserContext();
  const {
    logout,
    user,
    loginWithRedirect,
    isAuthenticated,
    getAccessTokenSilently,
    loginWithPopup,
  } = useAuth0();

  useEffect(() => {
    console.log(userId);
    console.log("login page");
    console.log("user", user);
    console.log("isAuthenticated", isAuthenticated);
    handleClickLogin();
  }, [user]);

  const handleClickLogin = async () => {
    console.log("clicked login button");
    console.log(isAuthenticated);

    if (!isAuthenticated) {
      loginWithPopup();
      // loginWithRedirect() does not work
      return;
    }

    const accessToken = await getAccessTokenSilently({
      audience: process.env.REACT_APP_AUDIENCE,
      scope: process.env.REACT_APP_SCOPE,
    });

    console.log("here");

    const response = await axios.post(
      `${BACKEND_URL}/users`,
      {
        firstName: user.given_name,
        lastName: user.family_name,
        email: user.email,
        username: user.name,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    console.log(response);
    console.log(accessToken);
    setUserId(response.data.id);

    console.log(userId);
    navigate("/workspace");
  };

  // to remove logout button as logout button will be in header
  return (
    <>
      <button onClick={handleClickLogin}>Login</button>
      <button
        onClick={() => {
          logout();
        }}
      >
        Log Out
      </button>
    </>
  );
};

export default Login;
