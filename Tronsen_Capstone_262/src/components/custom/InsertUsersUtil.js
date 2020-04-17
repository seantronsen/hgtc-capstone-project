import React from 'react';
import validator from 'validator';
import TextField from '../TextField';
import $ from 'jquery';
import ReturnResult from '../ReturnResult';

export default class InsertUsersUtil extends React.Component {
  state = {
    returnResultMessage: undefined,
  };

  componentDidMount() {}
  componentDidUpdate() {}

  handleSubmit = (data) => {
    $.ajax({
      url: '/backend/backendUsersadd',
      dataType: 'json',
      type: 'POST',
      data,
      success: (data, status, xhr) => {
        console.log(status);
        this.setState(() => ({ returnResultMessage: data.resMsg }));
      },
      error: (xhr, status, err) => {
        this.setState(() => ({ returnResultMessage: data.resMsg }));
      },
    });
  };

  handleFormatError = (message) => {
    this.setState(() => ({ returnResultMessage: message}));
  }
  render() {
    return (
      <div>
        {this.state.returnResultMessage && (
          <ReturnResult returnResultMessage={this.state.returnResultMessage} />
        )}
        <InsertUsersForm handleSubmit={this.handleSubmit} handleFormatError = {this.handleFormatError} />
      </div>
    );
  }
}

class InsertUsersForm extends React.Component {
  state = {
    username: '',
    password: '',
    name: '',
    position: '',
    phone: '',
    email: '',
    address: '',
    entry_user: 'TEST',
  };

  componentDidMount() {}
  componentDidUpdate() {}
  handleSubmit = (e) => {
    e.preventDefault();
    const username = this.state.username.trim();
    const password = this.state.password.trim();
    const name = this.state.name.trim();
    const position = this.state.position.trim();
    const phone = this.state.phone.trim();
    const email = this.state.email.trim();
    const address = this.state.address.trim();
    const entry_user = this.state.entry_user.trim();

    if (!this.checkUsername(username)) {
      this.props.handleFormatError('Username cannot be a blank value')
    } else if (!validator.isEmail(email)) {
      this.props.handleFormatError('Please enter a proper email')
    }
    else if (!this.checkPassword(password)) {
      this.props.handleFormatError('Password must have at least 8 characters')
    }
    else if (!validator.isMobilePhone(phone)) {
      this.props.handleFormatError('Please enter a proper phone number.')
    }
    else if (!this.checkAddress(address)) {
      this.props.handleFormatError('Please enter a proper address. To see the suggessted format, remove all values from the address field.')
    }
    else if (
      username &&
      password &&
      name &&
      position &&
      phone &&
      email &&
      address &&
      entry_user
    ) {
      this.props.handleSubmit({
        username,
        password,
        name,
        position,
        phone,
        email,
        address,
        entry_user,
      });
    } else {
      this.props.handleFormatError('A required value was not entered.')
    }
  };
  updateState = (field, value) => {
    this.setState(() => ({ [field]: value }));
    console.log(field, this.state[field]);
  };
  checkPassword = (string) => {
    return validator.isAscii && string.length > 7;
  };
  checkAddress = (string) => {
    console.log(validator.isPostalCode(string.substr(-6), 'any'));
    return validator.isAscii(string) && string.length > 15;
  };
  checkUsername = (string) => {
    return validator.isAscii(string) && !string.includes(' ');
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
            required={true}
            text='Enter a username'
            onChange={this.updateState}
            errorMessage='Username cannot contain spaces'
            emptyMessage='Username cannot be a blank value'
            validate={this.checkUsername}
          />
          <TextField
            labelTxt='Password'
            value={this.state.password}
            uniqueName='userPassword'
            fieldName='password'
            type='password'
            required={true}
            text='Enter a password'
            onChange={this.updateState}
            errorMessage='Minimum of 8 ASCII Characters Required'
            emptyMessage='Password cannot be a blank value'
            validate={this.checkPassword}
          />
          <TextField
            labelTxt='Full Name'
            value={this.state.name}
            uniqueName='userFullName'
            fieldName='name'
            type='text'
            required={true}
            text='Enter full name'
            onChange={this.updateState}
            errorMessage='Non-ASCII Characters Detected'
            emptyMessage='Full Name cannot be a blank value'
            validate={validator.isAscii}
          />
          <TextField
            labelTxt='Position'
            value={this.state.position}
            uniqueName='userPosition'
            fieldName='position'
            type='text'
            required={true}
            text='Enter job title'
            onChange={this.updateState}
            errorMessage='Non-ASCII Characters Detected'
            emptyMessage='Position cannot be a blank value'
            validate={validator.isAscii}
          />
          <TextField
            labelTxt='Phone Number'
            value={this.state.phone}
            uniqueName='userPhone'
            fieldName='phone'
            type='text'
            required={true}
            text='Enter phone number'
            onChange={this.updateState}
            errorMessage='Value entered is not a phone number'
            emptyMessage='Phone number cannot be a blank value'
            validate={validator.isMobilePhone}
          />
          <TextField
            labelTxt='Email'
            value={this.state.email}
            uniqueName='userEmail'
            fieldName='email'
            type='text'
            required={true}
            text='Enter email address'
            onChange={this.updateState}
            errorMessage='Value entered is not an email address'
            emptyMessage='Email address cannot be a blank value'
            validate={validator.isEmail}
          />
          <TextField
            labelTxt='Address'
            value={this.state.address}
            uniqueName='userAddress'
            fieldName='address'
            type='text'
            required={true}
            text='Enter full street address (555 Example RD, APT #, Springfield, VA 55555)'
            onChange={this.updateState}
            errorMessage='Value entered is not an address'
            emptyMessage='Address cannot be a blank value'
            validate={this.checkAddress}
          />
          <button type='submit' style={{ width: '15%' }}>
            Submit
          </button>
        </form>
      </div>
    );
  }
}
