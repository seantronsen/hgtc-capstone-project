import ReactDOM from 'react-dom'
import React from 'react'
import "../AuthScript";
import UtilBody from '../components/UtilBody'
import UpdateUsersUtil from '../components/custom/UpdateUsersUtil'
const description = 'The form below can be used to search all users that are in the system and update them accordingly. Note that there is no search button as the results will update in real time as you enter parameters into the form.'
const util = <UtilBody UtilDescriptionText={description} Util={<UpdateUsersUtil />} />
const root = document.getElementById('root');
ReactDOM.render(util, root);