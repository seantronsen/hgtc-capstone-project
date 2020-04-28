import ReactDOM from 'react-dom'
import React from 'react'
import "../AuthScript";
import UtilBody from '../components/UtilBody'
import ViewOrdersClosedUtil from '../components/custom/ViewOrdersClosedUtil'
const description = 'The form below can be used to search all closed orders that are in the system and view their details accordingly. Note that there is no search button as the results will update in real time as you enter parameters into the form.'
const util = <UtilBody UtilDescriptionText={description} Util={<ViewOrdersClosedUtil />} />
const root = document.getElementById('root');
ReactDOM.render(util, root);