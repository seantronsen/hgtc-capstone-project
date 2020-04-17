import React from 'react';
import validator from 'validator';
import TextField from '../TextField';
import $ from 'jquery';
import ReturnResult from '../ReturnResult'

export default class InsertLocationUtil extends React.Component {
  state = {
    returnResultMessage: undefined,
  };
  componentDidMount() {}

  componentDidUpdate() {}

  handleSubmit = (data) => {
    $.ajax({
      url: '/backend/backendlocationsadd',
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

  render() {
    return (
      <div>
        {this.state.returnResultMessage && (
          <ReturnResult returnResultMessage={this.state.returnResultMessage} />
        )}
        <InsertLocationForm handleSubmit={this.handleSubmit} />
      </div>
    );
  }
}


class InsertLocationForm extends React.Component {
  //locationUser will be switched into a props call later on for audit trails
  state = {
    locationBuilding: 'Capstone264Hotel Columbia',
    locationArea: '',
    locationSubArea: '',
    locationUser: 'TEST',
  };

  componentDidMount() {}

  componentDidUpdate() {}

  updateState = (field, value) => {
    this.setState(() => ({ [field]: value }));
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const area = this.state.locationArea;
    const subArea = this.state.locationSubArea;
    const user = this.state.locationUser.trim();
    const building = this.state.locationBuilding.trim();
    if (!area && !subArea && !building) return;
    else if (!validator.isAscii(area) || !validator.isAscii(subArea)) return;
    else {
      this.props.handleSubmit({ area, subArea, building, user });
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <TextField
            labelTxt='Building'
            value={this.state.locationBuilding}
            uniqueName='locationBuilding'
            fieldName='locationBuilding'
            type='text'
            required={true}
            text='Building Name'
            onChange={this.updateState}
            errorMessage='Non-ASCII Characters Detected'
            emptyMessage='Building cannot be a blank value'
            validate={validator.isAscii}
          />
          <TextField
            value={this.state.locationArea}
            labelTxt='Area'
            uniqueName='locationArea'
            fieldName='locationArea'
            type='text'
            required={true}
            text='Overall Area of the Building (Ex. Restaurant, Floor 01, Floor 02...)'
            onChange={this.updateState}
            errorMessage='Non-ASCII Characters Detected'
            emptyMessage='Building Area cannot be a blank value'
            validate={validator.isAscii}
          />
          <TextField
            labelTxt='Subarea'
            value={this.state.locationSubArea}
            uniqueName='locationSubArea'
            fieldName='locationSubArea'
            type='text'
            required={true}
            text='Location Within Specified Area (Table 11, Table 21, Room 03...) '
            onChange={this.updateState}
            errorMessage='Non-ASCII Characters Detected'
            emptyMessage='Building Subarea cannot be a blank value'
            validate={validator.isAscii}
          />
          <button type='submit' style={{width: '15%'}}>Submit</button>
        </form>
      </div>
    );
  }
}