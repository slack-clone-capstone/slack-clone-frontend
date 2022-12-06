import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Messaging from "./components/Messaging";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes></Routes>
  </BrowserRouter>
);

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
