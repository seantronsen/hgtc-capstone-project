import ReactDOM from 'react-dom'
import React from 'react'
import "../AuthScript";
import UtilBody from '../components/UtilBody'
import RemoveInventoryItemsUtil from '../components/custom/RemoveInventoryItemsUtil'
const description = 'The form below can be used to search all inventory items that are in the system and remove them accordingly. Note that there is no search button as the results will update in real time as you enter parameters into the form. Also note that the request for removal will be denied by the system if an item on the menu has the inventory item as one of its ingredients.'
const util = <UtilBody UtilDescriptionText={description} Util={<RemoveInventoryItemsUtil />} />
const root = document.getElementById('root');
ReactDOM.render(util, root);