import React from "react";
import { Link } from "react-router-dom";
import Header from "./common/Header";
import Sidebar from "./common/Sidebar";
import Body from "./common/Body";

// import SightingPreviewList from "./SightingPreviewList";

const Home = () => (
  <div>
    <Header />
    <div>
      <Sidebar />
      <Body />
    </div>
  </div>
);

export default Home;
