import React from 'react';
import DropDown from './DropDown';
import TextField from './TextField';
import OutputTable from './OutputTable';

export default class OutputDropDown extends React.Component {
  state = {
    textValue: '',
    outputData: [],
    outputIDs: [],
  };
  handleAdd = (e) => {
    e.preventDefault();
    console.log('out', this.state.outputData);
    const selector = document.getElementById(this.props.dropDownUniqueName);
    if (selector[selector.selectedIndex].textContent.length === 0) return;
    else if (
      !this.props.allowDups &&
      this.state.outputIDs.indexOf(selector[selector.selectedIndex].value) !== -1
    ) {
      this.props.outputUserError(this.props.existsError);
      return;
    } else {
      if (
        this.props.textFieldValidator(
          document.getElementById(this.props.textFieldUniqueName).value
        )
      ) {
        let newArrayData = this.state.outputData.slice();
        newArrayData = newArrayData.concat([
          [
            Date.now().toString() + '-' + selector[selector.selectedIndex].value,
            selector[selector.selectedIndex].textContent.trim(),
            document.getElementById(this.props.textFieldUniqueName).value,
          ],
        ]);
        let newArrayID = this.state.outputIDs.concat([
          selector[selector.selectedIndex].value,
        ]);
        this.setState(() => {
          return { outputData: newArrayData, outputIDs: newArrayID };
        });
        let newArrayParent = []
        newArrayData.forEach((arrayVar)=> {
          newArrayParent.push([].concat(arrayVar.slice()))
        })
        for (let i = 0; i < newArrayParent.length; i++) {
          if (newArrayParent[i][0].length > 3)
            newArrayParent[i][0] = newArrayParent[i][0].substr(14);
        }
        console.log(newArrayParent)
        this.props.parentUpdaterFunction(this.props.parentFieldName, newArrayParent);
      } else {
        this.props.outputUserError(this.props.textFieldErrorMessage);
      }
    }
  };
  handleRemove = (e) => {
    e.preventDefault();
    const idVal = e.target.value;
    const newArrayID = [];
    this.state.outputIDs.forEach((id) => {
      if (id !== idVal.substr(14)) newArrayID.push(id);
    });
    let newArrayData = [];
    let newArrayParent = [];
    this.state.outputData.forEach((set) => {
      if (set[0] != idVal) {
        newArrayData.push(set);
        let newSet = set.slice();
        newSet[0] = newSet[0].substr(14);
        console.log('set', set);
        console.log('newset', newSet);
        newArrayParent.push(newSet);
      }
    });
    console.log('data', newArrayData);
    console.log('parent', newArrayParent);
    this.setState(() => {
      return {
        outputData: newArrayData,
        outputIDs: newArrayID,
      };
    });
    this.props.parentUpdaterFunction(this.props.parentFieldName, newArrayParent);
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
    // let dataHolder = [].concat(this.state.outputData.slice())
    // let displayData = []
    // dataHolder.forEach((set) => {
    //   let newSet = [].concat(set)
    //   newSet[0] = newSet[0].substr(14)
    //   displayData.push(newSet)
    // })
    // //console.log('display data', displayData)
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
