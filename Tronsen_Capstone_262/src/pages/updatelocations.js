import ReactDOM from 'react-dom'
import React from 'react'
import UtilBody from '../components/UtilBody'
import UpdateLocationsUtil from '../components/custom/UpdateLocationsUtil'
const description = 'The form below can be used to search the locations that are available in the system and then update them accordingly. Locations in the system are primarily used to serve customers of the restaurant. Note that there is no search button as the results will update in real time as you enter parameters into the form.'
const util = <UtilBody UtilDescriptionText={description} Util={<UpdateLocationsUtil />} />
const root = document.getElementById('root');
ReactDOM.render(util, root);