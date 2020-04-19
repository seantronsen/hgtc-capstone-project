import React from 'react';
import OutputTable from '../OutputTable';
import $ from 'jquery';
import ReturnResult from '../ReturnResult';

export default class UpdateUsersUtil extends React.Component {
  state = {
    dataArray: [],
    dataArrayHeaders: [],
    returnResultMessage: '',
    pollEnabled: true,
  };
  componentDidMount() {
    this.loadDataFromServer();
    setInterval(this.loadDataFromServer.bind(this), 10000);
  }
  updateDataOnServer(data) {
    console.log('call');
    $.ajax({
      url: '/backend/backendUpdateScheduleData',
      dataType: 'json',
      type: 'PATCH',
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
        url: '/backend/backendLoadScheduleData',
        dataType: 'json',
        type: 'GET',
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
    const day = values[0];
    const openHour = values[1];
    const closeHour = values[2];
    const modificationUser = 'MODDER';
    if (!(day || openHour || closeHour || modificationUser)) {
      this.setState(() => {
        return {
          returnResultMessage:
            'All fields besides note are required, please fill in a value for the empty field before attempting resubmission.',
        };
      });
    } 
    else {
      this.updateDataOnServer({
          day,
          openHour,
          closeHour,
          modificationUser
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
        <UpdateScheduleForm
          dataArray={this.state.dataArray}
          dataArrayHeaders={this.state.dataArrayHeaders}
          disablePoll={this.disablePoll}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}
class UpdateScheduleForm extends React.Component {
  handleUpdate = (e) => {
    e.preventDefault();
    this.props.disablePoll();
    if (e.target.textContent === 'Edit') {
      const parent = e.target.parentNode.parentNode;
      const children = parent.childNodes;

      let values = [];
      for (let i = 0; i < children.length - 1; i++) {
        values.push(children[i].textContent);
      }
      parent.innerHTML = '';
      for (let i = 0; i < values.length; i++) {
        let cell = document.createElement('td');
        let input = document.createElement('input');
        i === 1 || i === 2 ? input.setAttribute('type', 'time') : input.setAttribute('type', 'text');
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

  prepData (matrix) {
    let newDataArray = matrix.slice();
    let displayData = [];
    newDataArray.map((row) => {
      let arrayFromObj = [];
      for (let i = 0; i < this.props.dataArrayHeaders.length; i++) {
        arrayFromObj.push(row[this.props.dataArrayHeaders[i]].toString());
      }
      displayData.push(arrayFromObj);
    });
    return displayData;
  }

  render() {
    return (
      <div>
        <h3 id='updateScheduleHeader'>Schedule</h3>
        <OutputTable
          outputTableHeaderData={this.props.dataArrayHeaders}
          data={this.prepData(this.props.dataArray)}
          editData={this.handleUpdate.bind(this)}
        />
      </div>
    );
  }
}
