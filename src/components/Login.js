import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserContext } from "../context/userContext";
import { useNavigate } from "react-router";
import { BACKEND_URL } from "./constants";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const {
    userId,
    setUserId,
    setUserFirstName,
    setUserLastName,
    setUserEmail,
    setUsername,
  } = useUserContext();
  const {
    user,
    loginWithRedirect,
    isAuthenticated,
    getAccessTokenSilently,
    loginWithPopup,
    logout,
    isLoading,
  } = useAuth0();

  // ?to implement refactoring on calling of the user info: https://github.com/auth0/auth0-react/issues/145
  // interestingly, this current method still enables user's data (e.g. given_name etc) to be passed to backend despite error being console.log.
  useEffect(() => {
    // const interval = setInterval(() => {
    //   console.log("This will run every second!");
    postUserBackend();
    // }, 1000);
    // return () => clearInterval(interval);
  }, [isAuthenticated]);

  const postUserBackend = async () => {
    const accessToken = await getAccessTokenSilently({});
    console.log("Posting to backend user data... " + user);
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

    setUserId(response.data.id);
    console.log("Backend user data updated.");
    setUserFirstName(user.given_name);
    setUserLastName(user.family_name);
    setUserEmail(user.email);
    setUsername(user.name);
    navigate("/workspace");
  };

  const handleClickLogin = async () => {
    console.log("Is user authenticated? " + isAuthenticated);
    if (!isAuthenticated) {
      // either option works
      // await loginWithPopup();
      await loginWithRedirect();
    }
    navigate("/workspace");
  };

  const handleClickLogout = () => {
    console.log("logout");
    navigate(`/login`);
    logout();
  };

  return (
    <>
      <button onClick={handleClickLogout}>Logout</button>
      <button onClick={handleClickLogin}>Login</button>
    </>
  );
};

export default Login;
