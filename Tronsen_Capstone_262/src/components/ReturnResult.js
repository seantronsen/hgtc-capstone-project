import React from 'react';

const ReturnResult = (props) => {
  return (
    <div className='ReturnResult' style={{ width: '100%' }}>
      <span style={{ width: '100%'}}>{props.returnResultMessage}</span>
    </div>
    
  );
};

export default ReturnResult;
