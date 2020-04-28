import ReactDOM from 'react-dom'
import React from 'react'
import "../AuthScript";
import UtilBody from '../components/UtilBody'
import ViewOrdersOpenUtil from '../components/custom/ViewOrdersOpenUtil'
const description = 'The form below can be used to search all open orders that are in the system and view their details accordingly. Note that there is no search button as the results will update in real time as you enter parameters into the form.'
const util = <UtilBody UtilDescriptionText={description} Util={<ViewOrdersOpenUtil />} />
const root = document.getElementById('root');
ReactDOM.render(util, root);