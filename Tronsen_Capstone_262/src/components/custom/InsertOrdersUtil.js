import React from 'react';
import TextField from '../TextField';
import ReturnResult from '../ReturnResult';
import $ from 'jquery';
import validator from 'validator';
import OutputDropDown from '../OutputDropDown';
import DropDown from '../DropDown';

export default class InsertOrdersUtil extends React.Component {
  state = {
    returnResultMessage: '',
    locationsArray: [],
    menuItemsArray: [],
  };
  componentDidMount() {
    this.loadInventoryItemsFromServer();
  }
  loadInventoryItemsFromServer() {
    $.ajax({
      url: '/backend/LoadOrderData',
      dataType: 'json',
      type: 'GET',
      success: (data, status, xhr) => {
        console.log(status);
        this.setState(() => ({
          returnResultMessage: data.resMsg,
          locationsArray: data.arrayDataLocations,
          menuItemsArray: data.arrayDataMenuItems,
        }));
      },
      error: (xhr, status, err) => {
        this.setState(() => ({
          returnResultMessage: err.toString(),
          locationsArray: [],
          menuItemsArray: [],
        }));
      },
    });
  }

  handleSubmit = (data) => {
    $.ajax({
      url: '/backend/backendOrdersAdd',
      dataType: 'json',
      type: 'POST',
      data,
      success: (data, status, xhr) => {
        console.log(status);
        this.setState(() => ({ returnResultMessage: data.resMsg }));
      },
      error: (xhr, status, err) => {
        this.setState(() => ({ returnResultMessage: err.resMsg }));
      },
    });
  };

  handleFormatError = (message) => {
    this.setState(() => ({ returnResultMessage: message }));
  };
  render() {
    return (
      <div>
        {this.state.returnResultMessage && (
          <ReturnResult returnResultMessage={this.state.returnResultMessage} />
        )}
        <InsertOrdersForm
          handleSubmit={this.handleSubmit}
          handleFormatError={this.handleFormatError}
          locationsArray={this.state.locationsArray}
          menuItemsArray={this.state.menuItemsArray}
        />
      </div>
    );
  }
}
class InsertOrdersForm extends React.Component {
  state = {
    location: '',
    status: 'OPEN',
    note: '',
    orderItems: [],
    entry_user: 'TEST',
  };
  componentDidMount() {}
  componentDidUpdate() {}
  handleSubmit = (e) => {
    e.preventDefault();
    const location = this.state.location.trim()
    const status = this.state.status.trim()
    const note = this.state.note.trim()
    const orderItems = this.state.orderItems
    const entry_user = this.state.entry_user.trim()
    if (!location) {
      this.props.handleFormatError('A location was not selected.')
      return 
    }
    else if (!orderItems.length) {
      this.props.handleFormatError('No items were selected for the order.')
      return 
    }
    else {
      this.props.handleSubmit({location, status, note, orderItems, entry_user})
    }
  };
  updateState = (field, value) => {
    this.setState(() => ({ [field]: value }));
  };
  handleAllow = (e) => {return true};
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <DropDown
            labelTxt='Location'
            uniqueName='orderLocation'
            fieldName='location'
            onChange={this.updateState}
            optionData={this.props.locationsArray}
            optionIDField='order_locations_id'
            optionTextField='area'
          />
          <TextField
            labelTxt='Order Overall Note'
            value={this.state.note}
            uniqueName='orderNote'
            fieldName='note'
            type='text'
            required={false}
            text='Overall note for the entire order to the kitchen'
            onChange={this.updateState}
            errorMessage=''
            emptyMessage=''
            validate={this.handleAllow}
          />
          <OutputDropDown
            dropDownLabelTxt='Order Items'
            dropDownUniqueName='orderItemsSelect'
            optionData={this.props.menuItemsArray}
            optionIDField='menu_items_id'
            optionTextField='item'
            textFieldLabelTxt='Item Note'
            textFieldUniqueName='itemNote'
            textFieldPlaceholder='Note for the specific item (Ex. MEDIUM, SEAFOOD ALLERGY)'
            textFieldErrorMessage=''
            textFieldEmptyMessage=''
            textFieldValidator={this.handleAllow}
            buttonText='Add Item to Order'
            outputTableHeaderData={['ID', 'Item', 'Note']}
            outputUserError={this.props.handleFormatError}
            existsError=''
            allowDups={true}
            deleteData={true}
            parentFieldName='orderItems'
            parentUpdaterFunction={this.updateState}
          />
          <button type='submit'>
            Submit
          </button>
        </form>
      </div>
    );
  }
}
