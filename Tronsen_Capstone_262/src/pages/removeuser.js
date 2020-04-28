import ReactDOM from 'react-dom'
import React from 'react'
import "../AuthScript";
import UtilBody from '../components/UtilBody'
import RemoveUsersUtil from '../components/custom/RemoveUserUtil'
const description = 'The form below can be used to search all users that are in the system and remove them as necessary. Note that there is no search button as the results will update in real time as you enter parameters into the form. Also make note that it is not recommended to delete users in terms of record keeping purposes. If possible, limit removals to users who have had no activity such those that were created by accident.'
const util = <UtilBody UtilDescriptionText={description} Util={<RemoveUsersUtil />} />
const root = document.getElementById('root');
ReactDOM.render(util, root);