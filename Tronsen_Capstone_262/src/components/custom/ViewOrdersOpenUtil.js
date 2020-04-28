import React from "react";
import TextField from "../TextField";
import OutputTable from "../OutputTable";
import $ from "jquery";
import ReturnResult from "../ReturnResult";
import Modal from "react-modal";

export default class ViewOrdersOpenUtil extends React.Component {
  state = {
    dataArray: [],
    dataArrayHeaders: [],
    returnResultMessage: "",
    pollEnabled: true,
    modalHeaderData: undefined,
    modalData: undefined,
  };
  componentDidMount() {
    this.loadDataFromServer();
    setInterval(this.loadDataFromServer.bind(this), 10000);
  }
  updateDataOnServer(data) {
    $.ajax({
      url: "/backend/backendLoadViewOrderData",
      dataType: "json",
      type: "GET",
      data,
      success: (data, status, xhr) => {
        console.log(data);

        this.setState(() => ({
            modalData: data.arrayData,
            modalHeaderData: data.arrayHeaderData
        }));
        this.loadDataFromServer();
      },
      error: (xhr, status, err) => {
        this.setState(() => ({
          returnResultMessage: err.resMsg,
        }));
      },
    });
  }

  loadDataFromServer = () => {
    if (this.state.pollEnabled) {
      $.ajax({
        url: "/backend/backendLoadFullOpenOrderData",
        dataType: "json",
        type: "GET",
        success: (data, status, xhr) => {
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

  handleRemoveModal = () => {
    this.setState(() => {
      return {
        modalData: undefined,
        modalHeaderData: undefined,
        pollEnabled: true,
      };
    });
  };

  handleSubmit = (value) => {
    const ID = value;

    if (!ID) {
      this.setState(() => {
        return {
          returnResultMessage: "Error Occurred.",
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
        <ViewOrdersForm
          dataArray={this.state.dataArray}
          dataArrayHeaders={this.state.dataArrayHeaders}
          disablePoll={this.disablePoll}
          handleSubmit={this.handleSubmit}
          handleRemoveModal={this.handleRemoveModal}
          modalData={this.state.modalData}
          modalHeaderData={this.state.modalHeaderData}
        />
      </div>
    );
  }
}
class ViewOrdersForm extends React.Component {
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

  arrayFromObjMatrix = (matrix) => {
    let newDataArray = matrix.slice();
    let newMatrix = [];
    newDataArray.map((row) => {
      let arrayFromObj = [];
      for (let i = 0; i < Object.keys(newDataArray[0]).length; i++) {
        arrayFromObj.push(row[Object.keys(newDataArray[0])[i]].toString());
      }
      newMatrix.push(arrayFromObj);
    });
    return newMatrix;
  };

  handleView = (e) => {
    e.preventDefault();
    this.props.disablePoll();
    const parent = e.target.parentNode.parentNode;
    const children = parent.childNodes;
    this.props.handleSubmit(children[0].textContent);
  };

  handleRemoveModal = () => {
    this.props.handleRemoveModal();
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
            labelTxt="Order Location"
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
            labelTxt="Entry Time"
            value={this.state.time}
            uniqueName="orderEntryTime"
            fieldName="time"
            type="text"
            required={false}
            text="Enter the time the order was placed"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
            validate={this.handleAllow}
          />
        </form>
        <OutputTable
          outputTableHeaderData={this.props.dataArrayHeaders}
          data={this.outputSearchArray(this.props.dataArray)}
          viewData={this.handleView.bind(this)}
        />
        <Modal
          isOpen={!!this.props.modalData}
          onRequestClose={this.handleRemoveModal}
          className="View-Modal"
        >
          {!!this.props.modalData ? (
            <OutputTable
              data={this.arrayFromObjMatrix(this.props.modalData)}
              outputTableHeaderData={this.props.modalHeaderData}
            />
          ) : undefined}
        </Modal>
      </div>
    );
  }
}
