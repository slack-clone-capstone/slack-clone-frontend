import { Navigate, Outlet } from "react-router";
import { useUserContext } from "../context/userContext";
import { useWorkspaceContext } from "../context/workspaceContext";
import { useAuth0 } from "@auth0/auth0-react";

const LoggedOutLayout = () => {
  const { userId } = useUserContext();
  const { workspaceId } = useWorkspaceContext();
  const { isLoading, error } = useAuth0();

  if (userId && workspaceId) {
    return <Navigate to="/" />;
  } else if (userId && !workspaceId) {
    return <Navigate to="/workspace" />;
  }

  return (
    <>
      {error && `${error}`}
      {!error && isLoading && <p>Loading...</p>}
      {!error && !isLoading && <Outlet />}
    </>
  );
};

export default LoggedOutLayout;
