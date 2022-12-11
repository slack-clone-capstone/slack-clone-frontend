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
    user,
    loginWithRedirect,
    isAuthenticated,
    getAccessTokenSilently,
    loginWithPopup,
  } = useAuth0();

  useEffect(() => {
    handleClickLogin();
  }, [user]);

  const handleClickLogin = async () => {
    if (!isAuthenticated) {
      loginWithPopup();
      // loginWithRedirect(); // does not work
      return;
    }

    const accessToken = await getAccessTokenSilently({
      audience: process.env.REACT_APP_AUDIENCE,
      scope: process.env.REACT_APP_SCOPE,
    });

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

    // setUserId(response.data.id);
    setUserId(1); // for testing purposes

    navigate("/workspace");
  };

  return (
    <>
      <button onClick={handleClickLogin}>Login</button>
    </>
  );
};

export default Login;
