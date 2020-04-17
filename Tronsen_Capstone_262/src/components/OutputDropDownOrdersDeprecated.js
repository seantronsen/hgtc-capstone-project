import React from 'react';
import DropDown from './DropDown';
import TextField from './TextField';
import OutputTable from './OutputTable'

export default class OutputDropDownOrders extends React.Component {
  state = {
    textValue: '',
    outputData: [],
    outputIDs: [],
  };
  handleAdd = (e) => {
    e.preventDefault();

    const selector = document.getElementById(this.props.dropDownUniqueName);
    if (selector[selector.selectedIndex].textContent.length === 0) {
        return;
    }
    else if (
      this.state.outputIDs.indexOf(selector[selector.selectedIndex].value) !== -1
    ) {
      this.props.outputUserError('You have already added this ingriedient to the item. ');
      return;
    } else {
      if (

        this.props.textFieldValidator(
          document.getElementById(this.props.textFieldUniqueName).value
        )
      ) {
        const newArrayData = this.state.outputData.concat([
          [
            selector[selector.selectedIndex].value,
            selector[selector.selectedIndex].textContent,
            document.getElementById(this.props.textFieldUniqueName).value,
          ],
        ]);
        const newArrayID = this.state.outputIDs.concat([
          selector[selector.selectedIndex].value,
        ]);
        this.setState(() => {
          return { outputData: newArrayData, outputIDs: newArrayID };
        });
        this.props.parentUpdaterFunction(this.props.parentFieldName, newArrayData);
      } else {
        this.props.outputUserError(this.props.textFieldErrorMessage);
      }
    }
  };
  handleRemove = (e) => {
    e.preventDefault();
    const idVal = e.target.value.substr(4);
    console.log(idVal);
    const newArrayID = [];
    this.state.outputIDs.forEach((id) => {
      if (id !== idVal) newArrayID.push(id);
    });
    console.log(newArrayID);
    let newArrayData = [];
    this.state.outputData.forEach((set) => {
      if (set[0] != idVal) newArrayData.push(set);
    });
    console.log(newArrayData);
    this.setState(() => {
      return {
        outputData: newArrayData,
        outputIDs: newArrayID,
      };
    });
    this.props.parentUpdaterFunction(this.props.parentFieldName, newArrayData);
  };

  handleEdit = () => {
    this.props.parentUpdaterFunction(this.props.parentFieldName, this.state.outputData);
  };
  updateState = (field, value) => {
    this.setState(() => ({ [field]: value }));
    console.log(field, this.state[field]);
  };
  handleEmpty = (e) => {};
  render() {
    return (
      <div>
        <DropDown
          labelTxt={this.props.dropDownLabelTxt}
          uniqueName={this.props.dropDownUniqueName}
          fieldName={undefined}
          onChange={this.handleEmpty}
          optionData={this.props.optionData}
          optionIDField={this.props.optionIDField}
          optionTextField={this.props.optionTextField}
        />
        <TextField
          labelTxt={this.props.textFieldLabelTxt}
          value={this.state.textValue}
          uniqueName={this.props.textFieldUniqueName}
          fieldName='textValue'
          type='text'
          required={false}
          text={this.props.textFieldPlaceholder}
          onChange={this.updateState}
          errorMessage={this.props.textFieldErrorMessage}
          emptyMessage={this.props.textFieldEmptyMessage}
          validate={this.props.textFieldValidator}
        />

        <button onClick={this.handleAdd}>{this.props.buttonText}</button>
        <OutputTable
          data={this.state.outputData}
          outputTableHeaderData={this.props.outputTableHeaderData}
          deleteData={this.handleRemove}
          editData={this.props.edit && this.handleEdit}
        />
      </div>
    );
  }
}

