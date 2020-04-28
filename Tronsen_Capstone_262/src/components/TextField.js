import React from "react";

export default class TextField extends React.Component {
  state = {
    isEmpty: true,
    value: null,
    valid: false,
    errorMessage: "",
    errorVisible: false,
  };

  handleChange = (event) => {
    if (this.props.onChange) {
      this.props.onChange(this.props.fieldName, event.target.value);
    }
    this.validation(
      event.target.value,
      this.props.validate(event.target.value)
    );
  };

  handleBlur = (event) => {
    this.validation(
      event.target.value,
      this.props.validate(event.target.value)
    );
  };
  validation(value, valid) {
    if (typeof valid === "undefined") {
      valid = true;
    }

    var message = "";
    var errorVisible = false;

    if (this.props.required && !value.length) {
      message = this.props.emptyMessage;
      valid = false;
      errorVisible = true;
    } else if (value.length < this.props.minCharacters) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    } else if (!valid) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    }

    this.setState({
      value: value,
      isEmpty: !value.length,
      valid: valid,
      errorMessage: message,
      errorVisible: errorVisible,
    });
  }

  render() {
    return (
      <div className='react-textfield-body'>
        <div
          className={"react-textfield  react-textfield" + this.props.uniqueName}
        >
          <label
            className="labels react-textfield_labels"
            for="this.props.uniqueName"
          >
            {this.props.labelTxt}
          </label>
          <input
            type={this.props.type}
            name={this.props.uniqueName}
            id={this.props.uniqueName}
            placeholder={this.props.text}
            className={
              "react-textfield-input react-textfield-input-" +
              this.props.uniqueName
            }
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            value={this.props.value}
            required={this.props.required}
          />
        </div>
        <InputError
          visible={this.state.errorVisible}
          errorMessage={this.state.errorMessage}
        />
      </div>

      /*
      <table style={{ width: '100%' }} className={this.props.uniqueName}>
        <tbody style={{ width: '100%' }}>
          <tr style={{ width: '100%' }}>
            <td style={{ width: '15%' }}>
              <label
                className='labels TextField-Labels'
                for='this.props.uniqueName'
                style={{ width: '100%', textAlign: 'right'}}
              >
                {this.props.labelTxt}
              </label>
            </td>
            <td style={{ width: '50%' }}>
              <input
                style={{ width: '100%' }}
                type={this.props.type}
                name={this.props.uniqueName}
                id={this.props.uniqueName}
                placeholder={this.props.text}
                className={'TextField TextField-' + this.props.uniqueName}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                value={this.props.value}
                required={this.props.required}
              />
            </td>
            <td style={{ width: '35%' }}>
              <InputError
                visible={this.state.errorVisible}
                errorMessage={this.state.errorMessage}
              />
            </td>
          </tr>
        </tbody>
      </table> */
    );
  }
}
const InputError = (props) => {
  return (
    <p className={"react-textfield-input-error react-textfield-input-error_" + props.visible}>
      {props.errorMessage}
    </p>

    /*
    <span style={{backgroundColor: '#FF8888',  width: '100%' }}>
      {props.visible && (
        <span style={{ width: '100%' }}>
          {props.errorMessage}
        </span>
      )}
    </span>*/
  );
};
