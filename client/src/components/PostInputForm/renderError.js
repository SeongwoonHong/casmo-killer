import React from 'react';

const renderError = (data) => {
  if (data && data.error && data.error.message) {
    return (
      <div className="alert alert-danger">
        { data ? data.error.message.title : '' }
      </div>
    );
  }
  return (<span />);
};

export default renderError;
