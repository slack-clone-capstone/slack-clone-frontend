import { Navigate, Outlet } from "react-router";
import { useUserContext } from "../context/userContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useWorkspaceContext } from "../context/workspaceContext";

const LoggedInLayout = () => {
  const { isAuthenticated } = useAuth0();
  const { userId } = useUserContext();
  const { workspaceId } = useWorkspaceContext();

  if (!userId) {
    return <Navigate to="/login" />;
  }
  // if (userId && workspaceId) {
  //   return <Navigate to="/" />;
  // }

  console.log("loggedin layout");

  return (
    <>
      <Outlet />
    </>
  );
};

export default LoggedInLayout;
