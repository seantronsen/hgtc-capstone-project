import React from 'react';

const OutputTable = (props) => {
  console.log(props.outputTableHeaderData)
  return (
    <table id="dataOutputTable">
      <thead>
        <tr>
          {props.outputTableHeaderData &&
            props.outputTableHeaderData.map((header) => {
              return <th>{header}</th>;
            })}
          {props.deleteData ? <th>Remove</th> : undefined}
          {props.editData ? <th>Edit</th> : undefined}
        </tr>
      </thead>
      <tbody>
        {props.data.length > 0 &&
          props.data.map((row) => {
            return (
              <OutputRow
                rowData={row}
                deleteData={props.deleteData}
                editData={props.editData}
              />
            );
          })}
      </tbody>
    </table>
  );
};

const OutputRow = (props) => {
  let id = props.rowData[0].toString();
  return (
    <tr id={id}>
      {props.rowData.map((dataCell) => {
        return <td>{dataCell}</td>;
      })}
      {props.deleteData ? (
        <td>
          <button value={id} onClick={props.deleteData}>
            Remove
          </button>
        </td>
      ) : undefined}
      {props.editData ? (
        <td>
          <button value={id} onClick={props.editData}>
            Edit
          </button>
        </td>
      ) : undefined}
    </tr>
  );
};

export default OutputTable;
