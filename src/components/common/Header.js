import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";

const Header = ({ setUserId, setWorkspaceId }) => {
  const { logout } = useAuth0();
  const navigate = useNavigate();

  const handleClickLogout = () => {
    logout();
    setUserId(null);
    setWorkspaceId(null);
    navigate("/login");
  };

  return (
    <div className="Header">
      <button>Help</button>
      <button>Profile</button>
      <button onClick={handleClickLogout}>Log Out</button>
    </div>
  );
};

export default Header;