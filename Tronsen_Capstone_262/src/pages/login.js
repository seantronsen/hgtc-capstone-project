import ReactDOM from "react-dom";
import React from "react";
import "../AuthScript";
import UtilBody from "../components/UtilBody";
import LoginUtil from "../components/custom/LoginUtil";
const description =
  "The form below can be used to login to the system. Those without authorization to access the backend of the system will be punished to the fullest extent of the law.";
const util = (
  <UtilBody UtilDescriptionText={description} Util={<LoginUtil />} />
);
const root = document.getElementById("root");
sessionStorage.setItem("user", undefined);
ReactDOM.render(util, root);
