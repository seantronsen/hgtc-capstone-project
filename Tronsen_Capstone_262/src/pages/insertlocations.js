import ReactDOM from 'react-dom'
import React from 'react'
import "../AuthScript";
import UtilBody from '../components/UtilBody'
import InsertLocationUtil from '../components/custom/InsertLocationsUtil'
const description = 'The form below can be used to add a location to the system. Locations in the system are primarily used to serve customers of the restaurant.'
const util = <UtilBody UtilDescriptionText={description} Util={<InsertLocationUtil />} />
const root = document.getElementById('root');
ReactDOM.render(util, root);