import ReactDOM from 'react-dom'
import React from 'react'
import UtilBody from '../components/UtilBody'
import UpdateScheduleUtil from '../components/custom/UpdateScheduleUtil'
const description = 'The form below can be used to update the system schedule. The schedule output below denotes the times where orders can be placed in the system and it is important to note that the moment an order is outside of the time range specified for a particular day, the system will deny the request. Updates will have no effect on orders made in the past as the schedule is just used as a measure to ensure that the staff does not place orders outside of restaurant hours.'
const util = <UtilBody UtilDescriptionText={description} Util={<UpdateScheduleUtil />} />
const root = document.getElementById('root');
ReactDOM.render(util, root);