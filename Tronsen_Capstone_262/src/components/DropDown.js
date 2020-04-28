import React from "react";

export default class DropDown extends React.Component {
  handleChange = (e) => {
    this.props.onChange(
      this.props.fieldName,
      e.target.options[e.target.selectedIndex].value
    );
  };
  render() {
    return (
      <div className={"react-dropdown react-dropdown-" + this.props.uniqueName}>
        <label for={this.props.uniqueName}>{this.props.labelTxt}</label>
        <select
          id={this.props.uniqueName}
          onChange={this.handleChange}
        >
          <option></option>
          {this.props.optionData &&
            this.props.optionData.map((option) => (
              <Option
                dataObject={option}
                hiddenValue={this.props.optionIDField}
                optionText={this.props.optionTextField}
              />
            ))}
        </select>
      </div>

      /*
      <table style={{ width: '100%' }}>
        <tbody style={{ width: '100%' }}>
          <tr style={{ width: '100%' }}>
            <td style={{ width: '15%' }}>
              <label for={this.props.uniqueName}>{this.props.labelTxt}</label>
            </td>
            <td style={{ width: '50%' }}>
              <select
                id={this.props.uniqueName}
                onChange={this.handleChange}
                style={{ width: '100%' }}
              >
                <option></option>
                {this.props.optionData &&
                  this.props.optionData.map((option) => (
                    <Option
                      dataObject={option}
                      hiddenValue={this.props.optionIDField}
                      optionText={this.props.optionTextField}
                    />
                  ))}
              </select>
            </td>
            <td style={{ width: '35%' }}>
              <p></p>
            </td>
          </tr>
        </tbody>
      </table>*/
    );
  }
}

const Option = (props) => {
  return (
    <option value={props.dataObject[props.hiddenValue]}>
      {props.dataObject[props.optionText]}
    </option>
  );
};
