import ReactDOM from 'react-dom'
import React from 'react'
import "../AuthScript";
import UtilBody from '../components/UtilBody'
import InsertUsersUtil from '../components/custom/InsertUsersUtil'
const description = 'The form below can be used to add users to the system. Note that after a user has been added, another user with higher privileges must set the added user\'s privileges in order for said user to be able to perform any tasks.'
const util = <UtilBody UtilDescriptionText={description} Util={<InsertUsersUtil />} />
const root = document.getElementById('root');
ReactDOM.render(util, root);