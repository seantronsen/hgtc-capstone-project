import ReactDOM from "react-dom";
import React from "react";
import "../AuthScript";
import UtilBody from "../components/UtilBody";
import InsertInventoryItemsUtil from "../components/custom/InsertInventoryItemsUtil";
const description =
  "The form below can be used to add items to the system's inventory. Note that this is an inventory that processses changes in real time meaning that items added here are immediately available within other forms that require them. Please ensure that a true quantity is entered as it is updated every time the item is used, whether as a standalone or as a part of something else.";
const util = (
  <UtilBody
    UtilDescriptionText={description}
    Util={<InsertInventoryItemsUtil />}
  />
);
const root = document.getElementById("root");
ReactDOM.render(util, root);
