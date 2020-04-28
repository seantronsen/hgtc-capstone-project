import React from 'react';
import TextField from '../TextField';
import OutputTable from '../OutputTable';
import $ from 'jquery';
import ReturnResult from '../ReturnResult';

export default class SearchUsersUtil extends React.Component {
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
      url: '/backend/backendLoadUserData',
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
        <SearchUsersForm
          dataArray={this.state.dataArray}
          dataArrayHeaders={this.state.dataArrayHeaders}
        />
      </div>
    );
  }
}
class SearchUsersForm extends React.Component {
  state = {
    username: '',
    name: '',
    position: '',
    phone: '',
    email: '',
    address: '',
    privileges: '',
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
        arrayFromObj[0].toLowerCase().includes(this.state.username.toLowerCase()) &&
        arrayFromObj[1].toLowerCase().includes(this.state.name.toLowerCase()) &&
        arrayFromObj[2].toLowerCase().includes(this.state.position.toLowerCase()) &&
        arrayFromObj[3].toLowerCase().includes(this.state.phone.toLowerCase()) &&
        arrayFromObj[4].toLowerCase().includes(this.state.email.toLowerCase()) &&
        arrayFromObj[5].toLowerCase().includes(this.state.address.toLowerCase()) &&
        arrayFromObj[6].toLowerCase().includes(this.state.privileges.toLowerCase())
      ) {
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
            labelTxt='Username'
            value={this.state.username}
            uniqueName='userUsername'
            fieldName='username'
            type='text'
            required={false}
            text='Enter username'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
          <TextField
            labelTxt='Full Name'
            value={this.state.name}
            uniqueName='userName'
            fieldName='name'
            type='text'
            required={false}
            text='Enter user full name'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
          <TextField
            labelTxt='Position'
            value={this.state.position}
            uniqueName='userPosition'
            fieldName='position'
            type='text'
            required={false}
            text='Enter user position'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
          <TextField
            labelTxt='Phone Number'
            value={this.state.phone}
            uniqueName='userPhone'
            fieldName='phone'
            type='text'
            required={false}
            text='Enter phone number'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
          <TextField
            labelTxt='Email'
            value={this.state.email}
            uniqueName='userEmail'
            fieldName='email'
            type='text'
            required={false}
            text='Enter email'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
          <TextField
            labelTxt='Address'
            value={this.state.address}
            uniqueName='userAddress'
            fieldName='address'
            type='text'
            required={false}
            text='Enter address'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
          <TextField
            labelTxt='Privileges'
            value={this.state.privileges}
            uniqueName='userPrivileges'
            fieldName='privileges'
            type='text'
            required={false}
            text='Enter privilege'
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
