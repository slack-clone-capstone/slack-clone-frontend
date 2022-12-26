import { Navigate, Outlet } from "react-router";
import { useUserContext } from "../context/userContext";
import { useAuth0 } from "@auth0/auth0-react";

const LoggedInLayout = () => {
  const { isAuthenticated } = useAuth0();
  const { userId } = useUserContext();

  if (!userId) {
    return <Navigate to="/login" />;
  }

  console.log("loggedin layout");

  return (
    <>
      <Outlet />
    </>
  );
};

export default LoggedInLayout;
