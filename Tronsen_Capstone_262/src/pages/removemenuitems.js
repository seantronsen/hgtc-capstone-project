import ReactDOM from 'react-dom'
import React from 'react'
import "../AuthScript";
import UtilBody from '../components/UtilBody'
import RemoveMenuItemsUtil from '../components/custom/RemoveMenuItemsUtil'
const description = 'The form below can be used to search all menu items that are in the system and remove them accordingly. Note that there is no search button as the results will update in real time as you enter parameters into the form. Also note that items should not be removed from the database for record keeping purposes unless it is for maintenance purposes.'
const util = <UtilBody UtilDescriptionText={description} Util={<RemoveMenuItemsUtil />} />
const root = document.getElementById('root');
ReactDOM.render(util, root);