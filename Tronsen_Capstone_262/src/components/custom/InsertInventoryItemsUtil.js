import React from 'react';
import validator from 'validator';
import TextField from '../TextField';
import DropDown from '../DropDown'
import $ from 'jquery';
import ReturnResult from '../ReturnResult';

export default class InsertInventoryItemsUtil extends React.Component {
    state = {
        returnResultMessage: undefined,
        typeData: []
    };

    componentDidMount() {
        this.loadTypesFromServer()
    }
    componentDidUpdate() {

    }
    loadTypesFromServer() {
        $.ajax({
            url: '/backend/backendInventoryLoadTypes',
            dataType: 'json',
            type: 'GET',
            success: (data, status, xhr) => {
                this.setState(() => ({ typeData: data.arrayData }));
            },
            error: (xhr, status, err) => {
                this.setState(() => ({ returnResultMessage: err.toString(), arrayData: [{}] }));
            },
        });
    };

    handleFormatError = (message) => {
        console.log(message)
        this.setState(() => ({ returnResultMessage: message }));
    }
    handleSubmit = (data) => {
        $.ajax({
            url: '/backend/backendInventoryAdd',
            dataType: 'json',
            type: 'POST',
            data,
            success: (data, status, xhr) => {
                this.setState(() => ({ returnResultMessage: data.resMsg }));
                this.loadTypesFromServer()
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
                <InsertInventoryItemsForm handleSubmit={this.handleSubmit} ItemTypeData={this.state.typeData} handleFormatError={this.handleFormatError} />
            </div>
        );
    }
}

class InsertInventoryItemsForm extends React.Component {
    state = {
        type: '',
        name: '',
        description: '',
        price: '',
        quantity: '',
        measurement: '',
        entry_user: localStorage.getItem('user'),
    };

    componentDidMount() { }
    componentDidUpdate() {
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const type = this.state.type.trim();
        const name = this.state.name.trim();
        const description = this.state.description.trim();
        const price = this.state.price.trim();
        const quantity = this.state.quantity.trim();
        const measurement = this.state.measurement.trim();
        const entry_user = this.state.entry_user.trim();
        if (validator.isEmpty(type)) {
            this.props.handleFormatError('Item type was not selected')
        }
        else if (!validator.isCurrency(price)) {
            this.props.handleFormatError('Value in price is not a form of currency')
        }
        else if (!validator.isNumeric(quantity)) {
            this.props.handleFormatError('Value in quantity is not numeric')
        }
        else if (
            type &&
            name &&
            description &&
            price &&
            quantity &&
            measurement &&
            entry_user
        ) {
            this.props.handleSubmit({
                type,
                name,
                description,
                price,
                quantity,
                measurement,
                entry_user
            });
        } else {
            this.props.handleFormatError('A required value was not entered.')
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
                        labelTxt='Item Name'
                        value={this.state.name}
                        uniqueName='inventoryItemName'
                        fieldName='name'
                        type='text'
                        required={true}
                        text='Enter the name of the product'
                        onChange={this.updateState}
                        errorMessage='Item name cannot include non-ASCII characters'
                        emptyMessage='Item name cannot be a blank value'
                        validate={validator.isAscii}
                    />
                    <TextField
                        labelTxt='Item Description'
                        value={this.state.description}
                        uniqueName='inventoryDescription'
                        fieldName='description'
                        type='text'
                        required={true}
                        text='Enter an item description'
                        onChange={this.updateState}
                        errorMessage='Item description cannot include non-ASCII characters'
                        emptyMessage='Item description cannot be a blank value'
                        validate={validator.isAscii}
                    />
                    <DropDown
                        labelTxt='Item Type'
                        uniqueName='inventoryType'
                        fieldName='type'
                        onChange={this.updateState}
                        optionData={this.props.ItemTypeData}
                        optionIDField='item_types_id'
                        optionTextField='item_types_type'


                    />
                    <TextField
                        labelTxt='Item Price'
                        value={this.state.price}
                        uniqueName='inventoryPrice'
                        fieldName='price'
                        type='text'
                        required={true}
                        text='Enter the price of the product'
                        onChange={this.updateState}
                        errorMessage='Invalid value for price. Please enter a dollar value.'
                        emptyMessage='Price cannot be a blank value'
                        validate={validator.isCurrency}
                    />
                    <TextField
                        labelTxt='Quantity'
                        value={this.state.quantity}
                        uniqueName='inventoryQuantity'
                        fieldName='quantity'
                        type='text'
                        required={true}
                        text='Enter the quantity being added to the inventory'
                        onChange={this.updateState}
                        errorMessage='Value entered is not numerical'
                        emptyMessage='Quantity cannot be a blank value'
                        validate={validator.isNumeric}
                    />
                    <TextField
                        labelTxt='Unit of Measurement'
                        value={this.state.measurement}
                        uniqueName='inventoryMeasurement'
                        fieldName='measurement'
                        type='text'
                        required={true}
                        text='Enter the base unit of measurement used with the product'
                        onChange={this.updateState}
                        errorMessage='Value entered is not an in the ASCII character set'
                        emptyMessage='Unit of measurement cannot be a blank value'
                        validate={validator.isAscii}
                    />
                    <button type='submit'>
                        Submit
            </button>
                </form>
            </div>
        );
    }
}
