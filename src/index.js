import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Messaging from "./components/Messaging";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_DOMAIN}
      clientId={process.env.REACT_APP_CLIENTID}
      redirectUri={window.location.origin}
      audience={process.env.REACT_APP_AUDIENCE}
      scope={process.env.REACT_APP_SCOPE}
    >
    <BrowserRouter>
      <Routes>
        <Route path="/" element={  <App />}/>
      </Routes>
    </BrowserRouter>
    
    </Auth0Provider>
  </React.StrictMode>

//  {/* Route that provides base app UI */}
//   <Route path="/" element={<App />}>
//     {/* Route that renders home content */}
//     <Route index element={<Home />} />
//     {/* Route that renders new listing form */}
//     <Route path="listings/new" element={<NewListingForm />} />
//     {/* Route that renders individual listings */}
//     {/* <Route path="listings/:listingId" element={<Listing />} /> */}
//     {/* Route that matches all other paths */}
//     <Route path="listings/:productId" element={<ListingProducts />} />
//     <Route
//       path="listings/:productId/:listingId"
//       element={<ListingBuy />}
//     />
//     <Route path="*" element={"Nothing here!"} />
//   </Route>
