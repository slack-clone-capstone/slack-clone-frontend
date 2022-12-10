import { Navigate, Outlet } from "react-router";
import { useUserContext } from "../context/userContext";
import { useWorkspaceContext } from "../context/workspaceContext";

const LoggedOutLayout = () => {
  const { userId } = useUserContext();
  const { workspaceId } = useWorkspaceContext();

  if (userId && workspaceId) {
    return <Navigate to="/" />;
  } else if (userId && !workspaceId) {
    return <Navigate to="/workspace" />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default LoggedOutLayout;
