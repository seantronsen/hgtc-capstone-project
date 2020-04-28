import ReactDOM from "react-dom";
import React from "react";
import "../AuthScript";
import UtilBody from "../components/UtilBody";
const description =
  "Welcome to the backend web client for Grandma's Greens. Please use the nav bar on the left side to carry out any functionality that you may need. Do note that access to certain features depends on the level of your privileges and that if you do not have sufficient privileges for a particular feature, you will be redirected here. ";
const util = (
  <UtilBody
    UtilDescriptionText={description}
    Util={<p></p>}
  />
);
const root = document.getElementById("root");
ReactDOM.render(util, root);
