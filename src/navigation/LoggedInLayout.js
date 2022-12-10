import { Navigate, Outlet } from "react-router";
import { useUserContext } from "../context/userContext";

const LoggedInLayout = () => {
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
