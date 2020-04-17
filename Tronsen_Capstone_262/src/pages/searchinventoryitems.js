import ReactDOM from 'react-dom'
import React from 'react'
import UtilBody from '../components/UtilBody'
import SearchInventoryItemsUtil from '../components/custom/SearchInventoryItemsUtil'
const description = 'The form below can be used to search the inventory items that exist within the system. Note that there is no search button as the results will update in real time as you enter parameters into the form.'
const util = <UtilBody UtilDescriptionText={description} Util={<SearchInventoryItemsUtil />} />
const root = document.getElementById('root');
ReactDOM.render(util, root);