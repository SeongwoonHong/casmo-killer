import React from 'react';
import PropTypes from 'prop-types';

import './FormMessage.scss';

const FormMessage = ({ message, type, children }) => {
  if (message && message.length > 0) {
    return (
      <div className={ `Form-message ${type}`}>
        <p>{ message }</p>
        { children }
      </div>
    );
  }
  return null;
};

FormMessage.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string
};

FormMessage.defaultProps = {
  message: '',
  type: 'error'
};

export default FormMessage;
