import ReactDOM from 'react-dom'
import React from 'react'
import "../AuthScript";
import UtilBody from '../components/UtilBody'
import InsertMenuItemsUtil from '../components/custom/InsertMenuItemsUtil'
const description = 'The form below can be used to add a new menu item to the system. Note that the price of the item is calculated automatically based '+
'on the sum of it\'s ingredients which is then multiplied by a 33% markup. If you need to specify a different price for the item, please use the '+
'corresponding Edit Items utility to do so as it will allow for this customization.'
const util = <UtilBody UtilDescriptionText={description} Util={<InsertMenuItemsUtil />} />
const root = document.getElementById('root');
ReactDOM.render(util, root);