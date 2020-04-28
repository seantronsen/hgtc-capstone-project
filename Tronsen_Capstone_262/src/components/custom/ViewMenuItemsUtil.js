import React from "react";
import TextField from "../TextField";
import OutputTable from "../OutputTable";
import $ from "jquery";
import ReturnResult from "../ReturnResult";
import Modal from "react-modal";

export default class ViewMenuItemsUtil extends React.Component {
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
      url: "/backend/backendViewMenuData",
      dataType: "json",
      type: "GET",
      data,
      success: (data, status, xhr) => {
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
        url: "/backend/backendLoadFullMenuData",
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
        <ViewMenuItemsForm
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
class ViewMenuItemsForm extends React.Component {
  state = {
    ID: "",
    name: "",
    description: "",
    price: "",
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
        arrayFromObj[1].toLowerCase().includes(this.state.name.toLowerCase()) &&
        arrayFromObj[2]
          .toLowerCase()
          .includes(this.state.description.toLowerCase()) &&
        arrayFromObj[3].toLowerCase().includes(this.state.price.toLowerCase())
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
    console.log(children[0].textContent);
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
            labelTxt="Item ID"
            value={this.state.ID}
            uniqueName="itemID"
            fieldName="ID"
            type="text"
            required={false}
            text="Enter item ID"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
            validate={this.handleAllow}
          />

          <TextField
            labelTxt="Item Name"
            value={this.state.name}
            uniqueName="itemName"
            fieldName="name"
            type="text"
            required={false}
            text="Enter item name"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
            validate={this.handleAllow}
          />
          <TextField
            labelTxt="Item Description"
            value={this.state.description}
            uniqueName="itemDescription"
            fieldName="description"
            type="text"
            required={false}
            text="Enter item description"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
            validate={this.handleAllow}
          />
          <TextField
            labelTxt="Item Price"
            value={this.state.price}
            uniqueName="itemPrice"
            fieldName="price"
            type="text"
            required={false}
            text="Enter item price"
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
           { !!this.props.modalData ? <OutputTable data={this.arrayFromObjMatrix(this.props.modalData)} outputTableHeaderData={this.props.modalHeaderData} /> : undefined}
        </Modal>
      </div>
    );
  }
}
