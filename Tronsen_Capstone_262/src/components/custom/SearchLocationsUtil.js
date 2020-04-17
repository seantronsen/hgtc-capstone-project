import React from 'react';
import TextField from '../TextField';
import OutputTable from '../OutputTable';
import $ from 'jquery';
import ReturnResult from '../ReturnResult';

export default class SearchLocationsUtil extends React.Component {
  state = {
    locationsData: [],
    headerData: [],
    returnResultMessage: '',
  };
  componentDidMount() {
    this.loadLocationsDataFromServer();
    setInterval(this.loadLocationsDataFromServer.bind(this), 10000);
  }
  loadLocationsDataFromServer = () => {
    $.ajax({
      url: '/backend/backendLoadLocationsData',
      dataType: 'json',
      type: 'GET',
      success: (data, status, xhr) => {
        console.log(status);
        this.setState(() => ({
          returnResultMessage: data.resMsg,
          locationsData: data.arrayData,
          headerData: data.arrayHeaderData,
        }));
      },
      error: (xhr, status, err) => {
        this.setState(() => ({ returnResultMessage: err.resMsg, locationsData: [], headerData: [] }));
      },
    });
  };
  render() {
    return (
      <div>
        {this.state.returnResultMessage && (
          <ReturnResult returnResultMessage={this.state.returnResultMessage} />
        )}
        <SearchLocationsForm
          locationsDataArray={this.state.locationsData}
          headerData={this.state.headerData}
        />
      </div>
    );
  }
}
class SearchLocationsForm extends React.Component {
  state = {
    building: '',
    area: '',
    subarea: '',
  };
  componentDidMount() {
  }
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
        arrayFromObj[0].toLowerCase().includes(this.state.building.toLowerCase()) &&
        arrayFromObj[1].toLowerCase().includes(this.state.area.toLowerCase()) &&
        arrayFromObj[2].toLowerCase().includes(this.state.subarea.toLowerCase())
      ) {
        searchedDisplayData.push(arrayFromObj);
      }
    });
    return searchedDisplayData
  }

  handleAllow = (e) => {
    return true;
  };
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <TextField
            labelTxt='Building'
            value={this.state.building}
            uniqueName='searchBuilding'
            fieldName='building'
            type='text'
            required={false}
            text='Enter building name'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
          <TextField
            labelTxt='Area'
            value={this.state.area}
            uniqueName='searchArea'
            fieldName='area'
            type='text'
            required={false}
            text='Enter building area'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
          <TextField
            labelTxt='Subarea'
            value={this.state.subarea}
            uniqueName='searchSubarea'
            fieldName='subarea'
            type='text'
            required={false}
            text='Enter building subarea'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
        </form>
        <OutputTable
          outputTableHeaderData={this.props.headerData}
          data={this.outputSearchArray(this.props.locationsDataArray)}
        />
      </div>
    );
  }
}
