import React from "react";
import TextField from "../TextField";
import OutputTable from "../OutputTable";
import $ from "jquery";
import ReturnResult from "../ReturnResult";
import validator from "validator";

export default class UpdateOrdersUtil extends React.Component {
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
  updateDataOnServer(data) {
    $.ajax({
      url: "/backend/backendUpdateOrderData",
      dataType: "json",
      type: "PATCH",
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
        url: "/backend/backendLoadFullOrderData",
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

  handleSubmit = (values) => {
    const ID = values[0];
    const locationID = values[1];
    const status = values[2];
    const note = values[3];
    const entry_user = [4];
    const modificationUser = localStorage.getItem("user");

    if (!(ID || locationID || status || entry_user)) {
      this.setState(() => {
        return {
          returnResultMessage:
            "All fields besides note are required, please fill in a value for the empty field before attempting resubmission.",
        };
      });
    } else if (!validator.isNumeric(ID) || !validator.isNumeric(locationID)) {
      this.setState(() => {
        return {
          returnResultMessage:
            "The ID that you have entered is not valid. Please enter the ID as a numeric value.",
        };
      });
    } else {
      this.updateDataOnServer({
        ID,
        locationID,
        status,
        note,
        entry_user,
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
        <UpdateOrdersForm
          dataArray={this.state.dataArray}
          dataArrayHeaders={this.state.dataArrayHeaders}
          disablePoll={this.disablePoll}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}
class UpdateOrdersForm extends React.Component {
  state = {
    ID: "",
    locationID: "",
    status: "",
    note: "",
    user: "",
    time: "",
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
        arrayFromObj[1]
          .toLowerCase()
          .includes(this.state.locationID.toLowerCase()) &&
        arrayFromObj[2]
          .toLowerCase()
          .includes(this.state.status.toLowerCase()) &&
        arrayFromObj[3].toLowerCase().includes(this.state.note.toLowerCase()) &&
        arrayFromObj[4].toLowerCase().includes(this.state.user.toLowerCase()) &&
        arrayFromObj[5].toLowerCase().includes(this.state.time.toLowerCase())
      ) {
        searchedDisplayData.push(arrayFromObj);
      }
    });
    return searchedDisplayData;
  }

  handleUpdate = (e) => {
    e.preventDefault();
    this.props.disablePoll();
    if (e.target.textContent === "Edit") {
      const parent = e.target.parentNode.parentNode;
      const children = parent.childNodes;

      let values = [];
      let child = parent.lastElementChild;
      for (let i = 0; i < children.length - 1; i++) {
        values.push(children[i].textContent);
      }
      parent.innerHTML = "";
      for (let i = 0; i < values.length; i++) {
        let cell = document.createElement("td");
        let input = document.createElement("input");
        input.setAttribute("type", "text");
        if (i === 0 || i === values.length)
          input.setAttribute("disabled", true);
        input.setAttribute("value", values[i]);
        cell.appendChild(input);
        parent.appendChild(cell);
      }
      let newButton = document.createElement("button");
      newButton.innerHTML = "Submit Changes";
      newButton.onclick = this.handleUpdate;
      let cell = document.createElement("td");
      cell.appendChild(newButton);
      parent.appendChild(cell);
    } else if (e.target.innerHTML === "Submit Changes") {
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
            labelTxt="Order ID"
            value={this.state.ID}
            uniqueName="orderID"
            fieldName="ID"
            type="text"
            required={false}
            text="Enter order ID"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
            validate={this.handleAllow}
          />
          <TextField
            labelTxt="Order Location ID"
            value={this.state.locationID}
            uniqueName="orderLocation"
            fieldName="locationID"
            type="text"
            required={false}
            text="Enter order location"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
            validate={this.handleAllow}
          />
          <TextField
            labelTxt="Order Status"
            value={this.state.status}
            uniqueName="orderStatus"
            fieldName="status"
            type="text"
            required={false}
            text="Enter order status"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
            validate={this.handleAllow}
          />
          <TextField
            labelTxt="Order Note"
            value={this.state.note}
            uniqueName="orderNote"
            fieldName="note"
            type="text"
            required={false}
            text="Enter order note"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
            validate={this.handleAllow}
          />
          <TextField
            labelTxt="User"
            value={this.state.user}
            uniqueName="orderEntryUser"
            fieldName="user"
            type="text"
            required={false}
            text="Enter user that submitted the order"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
            validate={this.handleAllow}
          />
          <TextField
            labelTxt="Last Modification Time"
            value={this.state.time}
            uniqueName="orderModificationTime"
            fieldName="time"
            type="text"
            required={false}
            text="Enter the last time the order was modified"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
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
