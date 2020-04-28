import ReactDOM from 'react-dom'
import React from 'react'
import "../AuthScript";
import UtilBody from '../components/UtilBody'
import InsertMenuItemsUtil from '../components/custom/InsertOrdersUtil'
const description = 'Place orders in the system via the form below. Note that all of your information is autofilled for ease of use based on your user ID.'
const util = <UtilBody UtilDescriptionText={description} Util={<InsertMenuItemsUtil />} />
const root = document.getElementById('root');
ReactDOM.render(util, root);