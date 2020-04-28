import React from 'react';
import TextField from '../TextField';
import OutputTable from '../OutputTable';
import $ from 'jquery';
import ReturnResult from '../ReturnResult';
import validator from 'validator';

export default class RemoveOrdersUtil extends React.Component {
  state = {
    dataArray: [],
    dataArrayHeaders: [],
    returnResultMessage: '',
    pollEnabled: true,
  };
  componentDidMount() {
    this.loadDataFromServer();
    setInterval(this.loadDataFromServer.bind(this), 10000);
  }
  updateDataOnServer(data) {
    $.ajax({
      url: '/backend/backendRemoveOrderData',
      dataType: 'json',
      type: 'POST',
      data,
      success: (data, status, xhr) => {
        console.log(status);

        this.setState(() => ({
          returnResultMessage: data.resMsg,
          pollEnabled: true,
          dataArray: [],
        }));
        this.loadDataFromServer();
      },
      error: (xhr, status, err) => {
        this.setState(() => ({
          returnResultMessage: err.resMsg,
          dataArray: [],
          dataArrayHeaders: [],
        }));
      },
    });
  }

  loadDataFromServer = () => {
    if (this.state.pollEnabled) {
      $.ajax({
        url: '/backend/backendLoadFullOrderData',
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
    }
  };

  handleSubmit = (value) => {
    const ID = value;

    if (!(ID)) {
      this.setState(() => {
        return {
          returnResultMessage:
            'Error Occurred.',
        };
      });
    } else {
      this.updateDataOnServer({
        ID,
      });
    }
  };

  disablePoll = () => {
    this.setState({ pollEnabled: false });
  };

  render() {
    return (
      <div>
        {this.state.returnResultMessage && (
          <ReturnResult returnResultMessage={this.state.returnResultMessage} />
        )}
        <RemoveOrdersForm
          dataArray={this.state.dataArray}
          dataArrayHeaders={this.state.dataArrayHeaders}
          disablePoll={this.disablePoll}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}
class RemoveOrdersForm extends React.Component {
  state = {
    ID: '',
    locationID: '',
    status: '',
    note: '',
    user: '',
    time: '',

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
      console.log(arrayFromObj);
      if (
        arrayFromObj[0].toLowerCase().includes(this.state.ID.toLowerCase()) &&
        arrayFromObj[1].toLowerCase().includes(this.state.locationID.toLowerCase()) &&
        arrayFromObj[2].toLowerCase().includes(this.state.status.toLowerCase()) &&
        arrayFromObj[3].toLowerCase().includes(this.state.note.toLowerCase()) &&
        arrayFromObj[4].toLowerCase().includes(this.state.user.toLowerCase()) && 
        arrayFromObj[5].toLowerCase().includes(this.state.time.toLowerCase()) 
      ) {
        searchedDisplayData.push(arrayFromObj);
      }
    });
    return searchedDisplayData;
  }

  handleRemove = (e) => {
    e.preventDefault();
    this.props.disablePoll();
    if (e.target.innerHTML === "Remove") {
      e.target.innerHTML = "Confirm";
    } else if (e.target.innerHTML === "Confirm") {
      const parent = e.target.parentNode.parentNode;
      const children = parent.childNodes;
      this.props.handleSubmit(children[0].textContent);
    }
  };

  handleAllow = (e) => {
    return true;
  };
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
        <TextField
            labelTxt='Order ID'
            value={this.state.ID}
            uniqueName='orderID'
            fieldName='ID'
            type='text'
            required={false}
            text='Enter order ID'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />  
        <TextField
            labelTxt='Order Location ID'
            value={this.state.locationID}
            uniqueName='orderLocation'
            fieldName='locationID'
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
            labelTxt='User'
            value={this.state.user}
            uniqueName='orderEntryUser'
            fieldName='user'
            type='text'
            required={false}
            text='Enter user that submitted the order'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
          <TextField
            labelTxt='Last Modification Time'
            value={this.state.time}
            uniqueName='orderModificationTime'
            fieldName='time'
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
          deleteData={this.handleRemove.bind(this)}
        />
      </div>
    );
  }
}