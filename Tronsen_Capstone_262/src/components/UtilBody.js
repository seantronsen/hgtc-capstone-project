import React from 'react';

const UtilBody = (props) => {
  return (
    <div id='UtilBody'>
      {props.UtilDescriptionText && (
        <UtilDescription UtilDescriptionText={props.UtilDescriptionText} />
      )}
      {props.Util && <UtilBox Util={props.Util} />}
    </div>
  );
};
const UtilBox = (props) => {
  return <div id='UtilBox'>{props.Util}</div>;
};
const UtilDescription = (props) => {
  return (
    <div id='UtilDescription'>
      <p>{props.UtilDescriptionText}</p>
    </div>
  );
};

export default UtilBody;
