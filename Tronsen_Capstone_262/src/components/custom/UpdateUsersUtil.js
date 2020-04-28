import React from 'react';
import TextField from '../TextField';
import OutputTable from '../OutputTable';
import $ from 'jquery';
import ReturnResult from '../ReturnResult';
import validator from 'validator';


export default class UpdateUsersUtil extends React.Component {
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
    console.log('call')
    $.ajax({
      url: '/backend/backendUpdateUserData',
      dataType: 'json',
      type: 'PATCH',
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
        url: '/backend/backendLoadFullUserData',
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

  handleSubmit = (values) => {
    const username = values[0];
    const password = values[1];
    const name = values[2];
    const position = values[3];
    const phone = values[4];
    const email = values[5];
    const address = values[6];
    const privileges = values[7];
    const modificationUser = localStorage.getItem('user');
    if (
      !(
        username ||
        password ||
        name ||
        position ||
        phone ||
        email ||
        address ||
        privileges ||
        modificationUser
      )
    ) {
      this.setState(() => {
        return {
          returnResultMessage:
            'All fields besides note are required, please fill in a value for the empty field before attempting resubmission.',
        };
      });
    } else if (!validator.isMobilePhone(phone)) {
      this.setState(() => {
        return {
          returnResultMessage:
            'The phone number that you have entered is invalid. Please enter a proper phone number.',
        };
      });
    } else if (!validator.isEmail(email)) {
      this.setState(() => {
        return {
          returnResultMessage:
            'The email address that you have entered is invalid. Please enter a proper email address for the user.',
        };
      });
    } else if (password.length < 8) {
      this.setState(() => {
        return {
          returnResultMessage:
            'Password does not meet the minimum length specified in the password policy.',
        };
      });
    } else if (
      // None || Viewing || Inserting || Editting || Updating || Deleting
      !(
        parseInt(privileges) === 0 ||
        parseInt(privileges) === 1 ||
        parseInt(privileges) === 2 ||
        parseInt(privileges) === 3 ||
        parseInt(privileges) === 4 ||
        parseInt(privileges) === 5
      )
    ) {
      this.setState(() => {
        return {
          returnResultMessage: 'The privilege value that was entered does not exist.',
        };
      });
    } else {
      this.updateDataOnServer({
        username,
        password,
        name,
        position,
        phone,
        email,
        address,
        privileges,
        modificationUser,
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
        <UpdateUsersForm
          dataArray={this.state.dataArray}
          dataArrayHeaders={this.state.dataArrayHeaders}
          disablePoll={this.disablePoll}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}
class UpdateUsersForm extends React.Component {
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
        arrayFromObj[0].toString().toLowerCase().includes(this.state.username.toLowerCase()) &&
        arrayFromObj[2].toString().toLowerCase().includes(this.state.name.toLowerCase()) &&
        arrayFromObj[3].toString().toLowerCase().includes(this.state.position.toLowerCase()) &&
        arrayFromObj[4].toString().toLowerCase().includes(this.state.phone.toLowerCase()) &&
        arrayFromObj[5].toString().toLowerCase().includes(this.state.email.toLowerCase()) &&
        arrayFromObj[6].toString().toLowerCase().includes(this.state.address.toLowerCase()) &&
        arrayFromObj[7].toString().toLowerCase().includes(this.state.privileges.toLowerCase())
      ) {
        searchedDisplayData.push(arrayFromObj);
      }
    });
    return searchedDisplayData;
  }

  handleUpdate = (e) => {
    e.preventDefault();
    this.props.disablePoll();
    if (e.target.textContent === 'Edit') {
      const parent = e.target.parentNode.parentNode;
      const children = parent.childNodes;

      let values = [];
      let child = parent.lastElementChild;
      for (let i = 0; i < children.length - 1; i++) {
        values.push(children[i].textContent);
      }
      parent.innerHTML = '';
      for (let i = 0; i < values.length; i++) {
        let cell = document.createElement('td');
        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        if (i === 0) input.setAttribute('disabled', true);
        input.setAttribute('value', values[i]);
        cell.appendChild(input);
        parent.appendChild(cell);
      }
      let newButton = document.createElement('button');
      newButton.innerHTML = 'Submit Changes';
      newButton.onclick = this.handleUpdate;
      let cell = document.createElement('td');
      cell.appendChild(newButton);
      parent.appendChild(cell);
    } else if (e.target.innerHTML === 'Submit Changes') {
      const parent = e.target.parentNode.parentNode;
      const children = parent.childNodes;
      let values = [];
      for (let i = 0; i < children.length - 1; i++) {
        values.push(children[i].children[0].value);
      }

      this.props.handleSubmit(values);
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
          editData={this.handleUpdate.bind(this)}
        />
      </div>
    );
  }
}
