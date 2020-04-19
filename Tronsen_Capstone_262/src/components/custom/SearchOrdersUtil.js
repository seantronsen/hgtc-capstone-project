import React from 'react';
import TextField from '../TextField';
import OutputTable from '../OutputTable';
import $ from 'jquery';
import ReturnResult from '../ReturnResult';

export default class SearchOrdersUtil extends React.Component {
  state = {
    dataArray: [],
    dataArrayHeaders: [],
    returnResultMessage: '',
  };
  componentDidMount() {
    this.loadLocationsDataFromServer();
    setInterval(this.loadLocationsDataFromServer.bind(this), 10000);
  }
  loadLocationsDataFromServer = () => {
    $.ajax({
      url: '/backend/backendLoadAllOrderData',
      dataType: 'json',
      type: 'GET',
      success: (data, status, xhr) => {
        console.log(status);
        this.setState(() => ({
          returnResultMessage: data.resMsg,
          dataArray: data.arrayData,
          dataArrayHeaders: data.arrayHeaderData,
        }));
      },
      error: (xhr, status, err) => {
        this.setState(() => ({
          returnResultMessage: err.resMsg,
          dataArray: [],
          dataArrayHeaders: [],
        }));
      },
    });
  };
  render() {
    return (
      <div>
        {this.state.returnResultMessage && (
          <ReturnResult returnResultMessage={this.state.returnResultMessage} />
        )}
        <SearchOrdersForm
          dataArray={this.state.dataArray}
          dataArrayHeaders={this.state.dataArrayHeaders}
        />
      </div>
    );
  }
}
class SearchOrdersForm extends React.Component {
  state = {
    location: '',
    status: '',
    note: '',
    entry_user: '',
    entry_time: '',
    modification_time: '',
  };
  componentDidMount() {}
  updateState = (field, value) => {
    this.setState(() => ({ [field]: value }));
  };
  outputSearchArray(matrix) {
    let newDataArray = matrix.slice();
    let searchedDisplayData = [];
    newDataArray.map((row) => {
      let arrayFromObj = [];
      for (let i = 0; i < this.props.dataArrayHeaders.length; i++) {
        arrayFromObj.push(row[this.props.dataArrayHeaders[i]].toString());
      }
      console.log(arrayFromObj)
      if (
                arrayFromObj[0].toLowerCase().includes(this.state.location.toLowerCase()) &&
                arrayFromObj[1].toLowerCase().includes(this.state.status.toLowerCase()) &&
                arrayFromObj[2].toLowerCase().includes(this.state.note.toLowerCase()) &&
                arrayFromObj[3].toLowerCase().includes(this.state.entry_user.toLowerCase()) &&
                arrayFromObj[4].toLowerCase().includes(this.state.entry_time.toLowerCase()) &&
                arrayFromObj[5].toLowerCase().includes(this.state.modification_time.toLowerCase())
          )
       {
        searchedDisplayData.push(arrayFromObj);
      }
    });
    return searchedDisplayData;
  }

  handleAllow = (e) => {
    return true;
  };
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <TextField
            labelTxt='Order Location'
            value={this.state.location}
            uniqueName='orderLocation'
            fieldName='location'
            type='text'
            required={false}
            text='Enter order location'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
          <TextField
            labelTxt='Order Status'
            value={this.state.status}
            uniqueName='orderStatus'
            fieldName='status'
            type='text'
            required={false}
            text='Enter order status'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
          <TextField
            labelTxt='Order Note'
            value={this.state.note}
            uniqueName='orderNote'
            fieldName='note'
            type='text'
            required={false}
            text='Enter order note'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
          <TextField
            labelTxt='Entry User'
            value={this.state.entry_user}
            uniqueName='orderEntryUser'
            fieldName='entry_user'
            type='text'
            required={false}
            text='Enter user that submitted the order'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
          <TextField
            labelTxt='Entry Time'
            value={this.state.entry_time}
            uniqueName='orderEntryTime'
            fieldName='entry_time'
            type='text'
            required={false}
            text='Enter the time the order was placed'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
          <TextField
            labelTxt='Last Modification'
            value={this.state.modification_time}
            uniqueName='orderModificationTime'
            fieldName='modification_time'
            type='text'
            required={false}
            text='Enter the last time the order was modified'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
        </form>
        <OutputTable
          outputTableHeaderData={this.props.dataArrayHeaders}
          data={this.outputSearchArray(this.props.dataArray)}
        />
      </div>
    );
  }
}
