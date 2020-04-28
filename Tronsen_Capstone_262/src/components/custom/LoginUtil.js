import React from "react";
import TextField from "../TextField";
import $ from "jquery";

export default class LoginUtil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: undefined,
      password: undefined,
    };
  }

  componentDidMount() {
    this.setState(() => {
      return {
        username: "",
        password: "",
      };
    });
  }

  handleAuth = (e) => {
    e.preventDefault();
    $.ajax({
      type: "POST",
      dataType: "json",
      url: "/backend/authenticate",
      data: { username: this.state.username, password: this.state.password },
      success: (data, status, xhr) => {
        if (data.valid) {
          localStorage.setItem("user", this.state.username);
          window.location.href =
            "/backend/backendhome" + "?user=" + this.state.username;
        } else {
          window.alert("Login Failed: Invalid Username or Password");
        }
      },
      error: () => {
        alert("Login Failed: Error occurred");
      },
    });
  };
  updateState = (field, value) => {
    this.setState(() => ({ [field]: value }));
  };

  handlePositiveValidate = () => {
    return true;
  };

  render() {
    localStorage.clear();
    return (
      <div className="login-form">
        <form onSubmit={this.handleAuth.bind(this)}>
          <TextField
            labelTxt="Username"
            value={this.state.username}
            uniqueName="userUsername"
            fieldName="username"
            type="text"
            required={true}
            text="Enter your username"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
            validate={this.handlePositiveValidate}
          />
          <TextField
            labelTxt="Password"
            value={this.state.password}
            uniqueName="userPassword"
            fieldName="password"
            type="password"
            required={true}
            text="Enter your password"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
            validate={this.handlePositiveValidate}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}
