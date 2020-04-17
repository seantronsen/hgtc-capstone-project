import React from 'react';
import TextField from '../TextField';
import OutputTable from '../OutputTable';
import $ from 'jquery';
import ReturnResult from '../ReturnResult';

export default class SearchInventoryItemsUtil extends React.Component {
  state = {
    dataArray: [],
    dataArrayHeaders: [],
    returnResultMessage: '',
  };
  componentDidMount() {
    this.loadLocationsDataFromServer();
    setInterval(this.loadLocationsDataFromServer.bind(this), 10000);
  }
  loadLocationsDataFromServer = () => {
    $.ajax({
      url: '/backend/backendLoadInventoryData',
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
  };
  render() {
    return (
      <div>
        {this.state.returnResultMessage && (
          <ReturnResult returnResultMessage={this.state.returnResultMessage} />
        )}
        <SearchInventoryItemsForm
          dataArray={this.state.dataArray}
          dataArrayHeaders={this.state.dataArrayHeaders}
        />
      </div>
    );
  }
}
class SearchInventoryItemsForm extends React.Component {
  state = {
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
      console.log(arrayFromObj)
      if (
                arrayFromObj[0].toLowerCase().includes(this.state.name.toLowerCase()) &&
                arrayFromObj[1].toLowerCase().includes(this.state.description.toLowerCase()) &&
                arrayFromObj[2].toLowerCase().includes(this.state.type.toLowerCase()) &&
                arrayFromObj[3].toLowerCase().includes(this.state.price.toLowerCase()) &&
                arrayFromObj[4].toLowerCase().includes(this.state.quantity.toLowerCase()) &&
                arrayFromObj[5].toLowerCase().includes(this.state.unit.toLowerCase())
          )
       {
        searchedDisplayData.push(arrayFromObj);
      }
    });
    return searchedDisplayData;
  }

  handleAllow = (e) => {
    return true;
  };
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
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
        />
      </div>
    );
  }
}
