import ReactDOM from 'react-dom'
import React from 'react'
import "../AuthScript";
import UtilBody from '../components/UtilBody'
import SearchUsersUtil from '../components/custom/SearchUsersUtil'
const description = 'The form below can be used to search the users that are in the system. Note that there is no search button as the results will update in real time as you enter parameters into the form.'
const util = <UtilBody UtilDescriptionText={description} Util={<SearchUsersUtil />} />
const root = document.getElementById('root');
ReactDOM.render(util, root);