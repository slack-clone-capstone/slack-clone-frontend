import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { UserContextProvider } from "./context/userContext";
import { WorkspaceContextProvider } from "./context/workspaceContext";
import App from "./components/App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Auth0Provider
    domain={process.env.REACT_APP_DOMAIN}
    clientId={process.env.REACT_APP_CLIENTID}
    redirectUri={window.location.origin}
    audience={process.env.REACT_APP_AUDIENCE}
    scope={process.env.REACT_APP_SCOPE}
    useRefreshTokens={true}
    cacheLocation="localstorage"
  >
    <BrowserRouter>
      <UserContextProvider>
        <WorkspaceContextProvider>
          <App />
        </WorkspaceContextProvider>
      </UserContextProvider>
    </BrowserRouter>
  </Auth0Provider>
  // </React.StrictMode>
);
