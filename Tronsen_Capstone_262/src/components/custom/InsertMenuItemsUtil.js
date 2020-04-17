import React from 'react';
import TextField from '../TextField';
import ReturnResult from '../ReturnResult';
import $ from 'jquery';
import validator from 'validator';
import OutputDropDown from '../OutputDropDown';

export default class InsertMenuItemsUtil extends React.Component {
  state = {
    returnResultMessage: '',
    inventoryItemArray: [],
  };
  componentDidMount() {
    this.loadInventoryItemsFromServer();
  }
  loadInventoryItemsFromServer() {
    $.ajax({
      url: '/backend/MenuIngridientsInventory',
      dataType: 'json',
      type: 'GET',
      success: (data, status, xhr) => {
        console.log(status);
        this.setState(() => ({
          returnResultMessage: data.resMsg,
          inventoryItemArray: data.arrayData,
        }));
      },
      error: (xhr, status, err) => {
        this.setState(() => ({
          returnResultMessage: err.toString(),
          inventoryItemArray: [],
        }));
      },
    });
  }

  handleSubmit = (data) => {
    $.ajax({
      url: '/backend/backendMenuItemsAdd',
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
        <InsertMenuItemsForm
          handleSubmit={this.handleSubmit}
          handleFormatError={this.handleFormatError}
          inventoryItemArray={this.state.inventoryItemArray}
        />
      </div>
    );
  }
}

class InsertMenuItemsForm extends React.Component {
  state = {
    name: '',
    description: '',
    ingridients: [],
    entry_user: 'TEST',
  };
  componentDidMount() {}
  componentDidUpdate() {}
  handleSubmit = (e) => {
    e.preventDefault();
    const name = this.state.name.trim();
    const description = this.state.description.trim();
    const ingridients = this.state.ingridients;
    const entry_user = this.state.entry_user.trim();
    if (!(name && description && entry_user)) {
      this.props.handleFormatError('A required field was left blank');
      return;
    } else if (!ingridients.length) {
      this.props.handleFormatError('No ingridients were selected for the menu item');
      return;
    } else {
      this.props.handleSubmit({ name, description, ingridients, entry_user });
    }
  };
  updateState = (field, value) => {
    this.setState(() => ({ [field]: value }));
    console.log(field, this.state[field]);
  };
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <TextField
            labelTxt='Menu Item Name'
            value={this.state.name}
            uniqueName='menuItemName'
            fieldName='name'
            type='text'
            required={true}
            text='Enter the name of the menu item'
            onChange={this.updateState}
            errorMessage='Item name cannot include non-ASCII characters'
            emptyMessage='Item name cannot be a blank value'
            validate={validator.isAscii}
          />
          <TextField
            labelTxt='Menu Item Description'
            value={this.state.description}
            uniqueName='menuItemDescription'
            fieldName='description'
            type='text'
            required={true}
            text='Enter an item description'
            onChange={this.updateState}
            errorMessage='Item description cannot include non-ASCII characters'
            emptyMessage='Item description cannot be a blank value'
            validate={validator.isAscii}
          />
          <OutputDropDown
            dropDownLabelTxt='Item Ingridients'
            dropDownUniqueName='ingridientSelect'
            optionData={this.props.inventoryItemArray}
            optionIDField='inventory_items_id'
            optionTextField='item'
            textFieldLabelTxt='Quantity'
            textFieldUniqueName='ingridientQuantity'
            textFieldPlaceHolder='Enter the numeric quantity of the ingridient in the unit listed.'
            textFieldErrorMessage='A numeric value must be entered. Do not include units or non-numeric text.'
            textFieldEmptyMessage=''
            textFieldValidator={validator.isNumeric}
            buttonText='Add Ingridient to Item'
            outputTableHeaderData={['ID', 'Item', 'Quantity']}
            outputUserError={this.props.handleFormatError}
            deleteData={true}
            parentFieldName='ingridients'
            parentUpdaterFunction={this.updateState}
            existsError='This ingridient has already been added to the item.'
            allowDups={false}
          />
          <button type='submit' style={{ width: '15%' }} >
            Submit
          </button>
        </form>
      </div>
    );
  }
}
