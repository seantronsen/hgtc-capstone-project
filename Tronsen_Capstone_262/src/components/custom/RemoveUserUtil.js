import React from "react";
import TextField from "../TextField";
import OutputTable from "../OutputTable";
import $ from "jquery";
import ReturnResult from "../ReturnResult";
import validator from "validator";

export default class RemoveUsersUtil extends React.Component {
  state = {
    dataArray: [],
    dataArrayHeaders: [],
    returnResultMessage: "",
    pollEnabled: true,
  };
  componentDidMount() {
    this.loadDataFromServer();
    setInterval(this.loadDataFromServer.bind(this), 10000);
  }
  removeDataOnServer(data) {
    console.log("call");
    $.ajax({
      url: "/backend/backendRemoveUserData",
      dataType: "json",
      type: "POST",
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
        url: "/backend/backendLoadFullUserData",
        dataType: "json",
        type: "GET",
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
    const username = value;
    if (!username) {
      this.setState(() => {
        return {
          returnResultMessage:
            "Error Occurred.",
        };
      });
    } else {
      this.removeDataOnServer({
        username,
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
        <RemoveUsersForm
          dataArray={this.state.dataArray}
          dataArrayHeaders={this.state.dataArrayHeaders}
          disablePoll={this.disablePoll}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}
class RemoveUsersForm extends React.Component {
  state = {
    username: "",
    name: "",
    position: "",
    phone: "",
    email: "",
    address: "",
    privileges: "",
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
        arrayFromObj[0]
          .toString()
          .toLowerCase()
          .includes(this.state.username.toLowerCase()) &&
        arrayFromObj[2]
          .toString()
          .toLowerCase()
          .includes(this.state.name.toLowerCase()) &&
        arrayFromObj[3]
          .toString()
          .toLowerCase()
          .includes(this.state.position.toLowerCase()) &&
        arrayFromObj[4]
          .toString()
          .toLowerCase()
          .includes(this.state.phone.toLowerCase()) &&
        arrayFromObj[5]
          .toString()
          .toLowerCase()
          .includes(this.state.email.toLowerCase()) &&
        arrayFromObj[6]
          .toString()
          .toLowerCase()
          .includes(this.state.address.toLowerCase()) &&
        arrayFromObj[7]
          .toString()
          .toLowerCase()
          .includes(this.state.privileges.toLowerCase())
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
            labelTxt="Username"
            value={this.state.username}
            uniqueName="userUsername"
            fieldName="username"
            type="text"
            required={false}
            text="Enter username"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
            validate={this.handleAllow}
          />
          <TextField
            labelTxt="Full Name"
            value={this.state.name}
            uniqueName="userName"
            fieldName="name"
            type="text"
            required={false}
            text="Enter user full name"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
            validate={this.handleAllow}
          />
          <TextField
            labelTxt="Position"
            value={this.state.position}
            uniqueName="userPosition"
            fieldName="position"
            type="text"
            required={false}
            text="Enter user position"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
            validate={this.handleAllow}
          />
          <TextField
            labelTxt="Phone Number"
            value={this.state.phone}
            uniqueName="userPhone"
            fieldName="phone"
            type="text"
            required={false}
            text="Enter phone number"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
            validate={this.handleAllow}
          />
          <TextField
            labelTxt="Email"
            value={this.state.email}
            uniqueName="userEmail"
            fieldName="email"
            type="text"
            required={false}
            text="Enter email"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
            validate={this.handleAllow}
          />
          <TextField
            labelTxt="Address"
            value={this.state.address}
            uniqueName="userAddress"
            fieldName="address"
            type="text"
            required={false}
            text="Enter address"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
            validate={this.handleAllow}
          />
          <TextField
            labelTxt="Privileges"
            value={this.state.privileges}
            uniqueName="userPrivileges"
            fieldName="privileges"
            type="text"
            required={false}
            text="Enter privilege"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
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
