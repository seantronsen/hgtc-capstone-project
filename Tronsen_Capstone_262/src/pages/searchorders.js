import ReactDOM from 'react-dom'
import React from 'react'
import "../AuthScript";
import UtilBody from '../components/UtilBody'
import SearchOrdersUtil from '../components/custom/SearchOrdersUtil'
const description = 'The form below can be used to search all orders that are in the system. Note that there is no search button as the results will update in real time as you enter parameters into the form.'
const util = <UtilBody UtilDescriptionText={description} Util={<SearchOrdersUtil />} />
const root = document.getElementById('root');
ReactDOM.render(util, root);