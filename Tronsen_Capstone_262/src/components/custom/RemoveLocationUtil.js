import React from "react";
import TextField from "../TextField";
import OutputTable from "../OutputTable";
import $ from "jquery";
import ReturnResult from "../ReturnResult";
import validator from "validator";

export default class RemoveLocationsUtil extends React.Component {
  state = {
    locationsData: [],
    headerData: [],
    returnResultMessage: "",
    pollEnabled: true,
  };
  componentDidMount() {
    this.loadLocationsDataFromServer();
    setInterval(this.loadLocationsDataFromServer.bind(this), 10000);
  }

  removeOnServer(data) {
    $.ajax({
      url: "/backend/backendRemoveLocationsData",
      dataType: "json",
      type: "POST",
      data,
      success: (data, status, xhr) => {
        console.log(status);

        this.setState(() => ({
          returnResultMessage: data.resMsg,
          pollEnabled: true,
          locationsData: [],
        }));
        this.loadLocationsDataFromServer();
      },
      error: (xhr, status, err) => {
        this.setState(() => ({
          returnResultMessage: err.resMsg,
          locationsData: [],
          headerData: [],
        }));
      },
    });
  }

  loadLocationsDataFromServer = () => {
    if (this.state.pollEnabled) {
      $.ajax({
        url: "/backend/backendLoadFullLocationsData",
        dataType: "json",
        type: "GET",
        success: (data, status, xhr) => {
          console.log(status);
          this.setState(() => ({
            returnResultMessage: data.resMsg,
            locationsData: data.arrayData,
            headerData: data.arrayHeaderData,
          }));
        },
        error: (xhr, status, err) => {
          this.setState(() => ({
            returnResultMessage: err.resMsg,
            locationsData: [],
            headerData: [],
          }));
        },
      });
    }
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
      this.removeOnServer({ ID });
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
        <RemoveLocationsForm
          locationsDataArray={this.state.locationsData}
          headerData={this.state.headerData}
          disablePoll={this.disablePoll}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}
class RemoveLocationsForm extends React.Component {
  state = {
    locationID: "",
    building: "",
    area: "",
    subarea: "",
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
      for (let i = 0; i < this.props.headerData.length; i++) {
        arrayFromObj.push(row[this.props.headerData[i]]);
      }
      if (
        arrayFromObj[0]
          .toString()
          .toLowerCase()
          .includes(this.state.locationID.toLowerCase()) &&
        arrayFromObj[1]
          .toString()
          .toLowerCase()
          .includes(this.state.building.toLowerCase()) &&
        arrayFromObj[2]
          .toString()
          .toLowerCase()
          .includes(this.state.area.toLowerCase()) &&
        arrayFromObj[3]
          .toString()
          .toLowerCase()
          .includes(this.state.subarea.toLowerCase())
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
            labelTxt="ID"
            value={this.state.locationID}
            uniqueName="IDINPUTTARGET"
            fieldName="locationID"
            type="text"
            required={false}
            text="Enter location ID"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
            validate={this.handleAllow}
          />
          <TextField
            labelTxt="Building"
            value={this.state.building}
            uniqueName="searchBuilding"
            fieldName="building"
            type="text"
            required={false}
            text="Enter building name"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
            validate={this.handleAllow}
          />
          <TextField
            labelTxt="Area"
            value={this.state.area}
            uniqueName="searchArea"
            fieldName="area"
            type="text"
            required={false}
            text="Enter building area"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
            validate={this.handleAllow}
          />
          <TextField
            labelTxt="Subarea"
            value={this.state.subarea}
            uniqueName="searchSubarea"
            fieldName="subarea"
            type="text"
            required={false}
            text="Enter building subarea"
            onChange={this.updateState}
            errorMessage=""
            emptyMessage=""
            validate={this.handleAllow}
          />
        </form>
        <OutputTable
          outputTableHeaderData={this.props.headerData}
          data={this.outputSearchArray(this.props.locationsDataArray)}
          deleteData={this.handleRemove.bind(this)}
        />
      </div>
    );
  }
}
