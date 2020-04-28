import ReactDOM from 'react-dom'
import React from 'react'
import "../AuthScript";
import UtilBody from '../components/UtilBody'
import ViewInventoryStockUtil from '../components/custom/ViewInventoryStockUtil'
const description = 'The form below can be used to search the inventory items that exist within the system and view them by the quantity remaining. Note that there is no search button as the results will update in real time as you enter parameters into the form.'
const util = <UtilBody UtilDescriptionText={description} Util={<ViewInventoryStockUtil />} />
const root = document.getElementById('root');
ReactDOM.render(util, root);