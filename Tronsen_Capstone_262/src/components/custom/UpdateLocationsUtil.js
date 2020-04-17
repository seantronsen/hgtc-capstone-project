import React from 'react';
import TextField from '../TextField';
import OutputTable from '../OutputTable';
import $ from 'jquery';
import ReturnResult from '../ReturnResult';
import validator from 'validator';

export default class UpdateLocationsUtil extends React.Component {
  state = {
    locationsData: [],
    headerData: [],
    returnResultMessage: '',
    pollEnabled: true,
  };
  componentDidMount() {
    this.loadLocationsDataFromServer();
    setInterval(this.loadLocationsDataFromServer.bind(this), 10000);
  }

  updateLocationOnServer(data) {
    $.ajax({
      url: '/backend/backendUpdateLocationsData',
      dataType: 'json',
      type: 'PATCH',
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
        url: '/backend/backendLoadFullLocationsData',
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
          this.setState(() => ({
            returnResultMessage: err.resMsg,
            locationsData: [],
            headerData: [],
          }));
        },
      });
    }
  };
  handleSubmit = (values) => {
    console.log(values);
    const ID = values[0];
    const building = values[1];
    const area = values[2];
    const subarea = values[3];
    const entry_user = 'TEST';

    if (!(ID || building || area || subarea || entry_user)) {
      this.setState(() => {
        return {
          returnResultMessage:
            'All fields are required, please fill in a value for the empty field before attempting resubmission.',
        };
      });
    } else if (!validator.isAscii(ID.toString() + building + area + subarea)) {
      this.setState(() => {
        return {
          returnResultMessage: 'Please enter in regular text only.',
        };
      });
    } else if (!validator.isNumeric(ID.toString())) {
      this.setState(() => {
        return {
          returnResultMessage: 'Please do not use dev tools to try and change the ID.',
        };
      });
    } else {
      this.updateLocationOnServer({ ID, building, area, subarea, entry_user });
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
        <UpdateLocationsForm
          locationsDataArray={this.state.locationsData}
          headerData={this.state.headerData}
          disablePoll={this.disablePoll}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}
class UpdateLocationsForm extends React.Component {
  state = {
    locationID: '',
    building: '',
    area: '',
    subarea: '',
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
            labelTxt='ID'
            value={this.state.locationID}
            uniqueName='IDINPUTTARGET'
            fieldName='locationID'
            type='text'
            required={false}
            text='Enter location ID'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
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
          editData={this.handleUpdate.bind(this)}
        />
      </div>
    );
  }
}
