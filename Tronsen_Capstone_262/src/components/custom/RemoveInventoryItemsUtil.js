import React from 'react';
import TextField from '../TextField';
import OutputTable from '../OutputTable';
import $ from 'jquery';
import ReturnResult from '../ReturnResult';
import validator from 'validator';

export default class RemoveInventoryItemsUtil extends React.Component {
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
  removeDataOnServer(data) {
    $.ajax({
      url: '/backend/backendRemoveInventoryData',
      dataType: 'json',
      type: 'POST',
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
        url: '/backend/backendLoadFullInventoryData',
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

  handleSubmit = (value) => {
    const ID = value;

    if (!(ID)) {
      this.setState(() => {
        return {
          returnResultMessage:
            'Error Occurred.',
        };
      });
    } else {
      this.removeDataOnServer({
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
        <RemoveInventoryItemsForm
          dataArray={this.state.dataArray}
          dataArrayHeaders={this.state.dataArrayHeaders}
          disablePoll={this.disablePoll}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}
class RemoveInventoryItemsForm extends React.Component {
  state = {
    ID: '',
    name: '',
    description: '',
    type: '',
    price: '',
    quantity: '',
    unit: '',
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
        arrayFromObj[2].toLowerCase().includes(this.state.description.toLowerCase()) &&
        arrayFromObj[3].toLowerCase().includes(this.state.type.toLowerCase()) &&
        arrayFromObj[4].toLowerCase().includes(this.state.price.toLowerCase()) &&
        arrayFromObj[5].toLowerCase().includes(this.state.quantity.toLowerCase()) &&
        arrayFromObj[6].toLowerCase().includes(this.state.unit.toLowerCase())
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
            labelTxt='Item ID'
            value={this.state.ID}
            uniqueName='itemID'
            fieldName='ID'
            type='text'
            required={false}
            text='Enter item ID'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
          <TextField
            labelTxt='Item Name'
            value={this.state.name}
            uniqueName='itemName'
            fieldName='name'
            type='text'
            required={false}
            text='Enter item name'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
          <TextField
            labelTxt='Item Description'
            value={this.state.description}
            uniqueName='itemDescription'
            fieldName='description'
            type='text'
            required={false}
            text='Enter item description'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
          <TextField
            labelTxt='Item Type'
            value={this.state.type}
            uniqueName='itemType'
            fieldName='type'
            type='text'
            required={false}
            text='Enter item type'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
          <TextField
            labelTxt='Item Price'
            value={this.state.price}
            uniqueName='itemPrice'
            fieldName='price'
            type='text'
            required={false}
            text='Enter item price'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
          <TextField
            labelTxt='Inventory Quantity'
            value={this.state.quantity}
            uniqueName='itemQuantity'
            fieldName='quantity'
            type='text'
            required={false}
            text='Enter quantity of item in inventory'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
          <TextField
            labelTxt='Unit of Measurement'
            value={this.state.unit}
            uniqueName='itemUnit'
            fieldName='unit'
            type='text'
            required={false}
            text='Enter measurement unit for item'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
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
