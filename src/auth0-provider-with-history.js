// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Auth0Provider } from "@auth0/auth0-react";

// const Auth0ProviderWithHistory = ({ children }) => {
//   const navigate = useNavigate();

//   const onRedirectCallback = (appState) => {
//     navigate(appState?.returnTo || window.location.pathname);
//   };

//   return (
//     <Auth0Provider
//       domain={process.env.REACT_APP_DOMAIN}
//       clientId={process.env.REACT_APP_CLIENTID}
//       redirectUri={window.location.origin}
//       audience={process.env.REACT_APP_AUDIENCE}
//       scope={process.env.REACT_APP_SCOPE}
//       useRefreshTokens={true}
//       cacheLocation="localstorage"
//       onRedirectCallback={onRedirectCallback}
//     >
//       {children}
//     </Auth0Provider>
//   );
// };

// export default Auth0ProviderWithHistory;
