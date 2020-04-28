import ReactDOM from 'react-dom'
import React from 'react'
import "../AuthScript";
import UtilBody from '../components/UtilBody'
import RemoveOrdersUtil from '../components/custom/RemoveOrdersUtil'
const description = 'The form below can be used to search all orders that are in the system and remove them accordingly. Note that there is no search button as the results will update in real time as you enter parameters into the form. Also note that orders should not be removed for record keeping purposes. Only do so if the order was a mistake or for general maintenance.'
const util = <UtilBody UtilDescriptionText={description} Util={<RemoveOrdersUtil />} />
const root = document.getElementById('root');
ReactDOM.render(util, root);