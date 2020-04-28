import React from "react";

const OutputTable = (props) => {
  return (
    <table className="dataOutputTable">
      <thead>
        <tr>
          {props.outputTableHeaderData &&
            props.outputTableHeaderData.map((header) => {
              return <th>{header}</th>;
            })}
          {props.deleteData ? <th>Remove</th> : undefined}
          {props.editData ? <th>Edit</th> : undefined}
          {props.viewData ? <th>View</th> : undefined}
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
                viewData={props.viewData}
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
      {props.viewData ? (
        <td>
          <button value={id} onClick={props.viewData}>
            View
          </button>
        </td>
      ) : undefined}
    </tr>
  );
};

export default OutputTable;
