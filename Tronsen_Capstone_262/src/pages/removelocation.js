import ReactDOM from 'react-dom'
import React from 'react'
import "../AuthScript";
import UtilBody from '../components/UtilBody'
import RemoveLocationUtil from '../components/custom/RemoveLocationUtil'
const description = 'The form below can be used to remove a location to the system. Note that removing a location means that all records referencing that location will now reference a null value. Locations in the system are primarily used to serve customers of the restaurant.'
const util = <UtilBody UtilDescriptionText={description} Util={<RemoveLocationUtil />} />
const root = document.getElementById('root');
ReactDOM.render(util, root);