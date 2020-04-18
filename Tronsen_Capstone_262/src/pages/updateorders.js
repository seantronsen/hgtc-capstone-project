import ReactDOM from 'react-dom'
import React from 'react'
import UtilBody from '../components/UtilBody'
import UpdateOrdersUtil from '../components/custom/UpdateOrdersUtil'
const description = 'The form below can be used to search all orders that are in the system and update them accordingly. Note that there is no search button as the results will update in real time as you enter parameters into the form.'
const util = <UtilBody UtilDescriptionText={description} Util={<UpdateOrdersUtil />} />
const root = document.getElementById('root');
ReactDOM.render(util, root);