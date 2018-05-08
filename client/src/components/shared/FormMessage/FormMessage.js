import React from 'react';
import PropTypes from 'prop-types';

import './FormMessage.scss';

const FormMessage = ({
  className, message, type, children
}) => {

  if (message && message.length > 0) {
    return (
      <div className={ `Form-message ${className} Form-message--${type}`}>
        <p className="Form-message__text">{ message }</p>
        { children }
      </div>
    );
  }

  return null;

};

FormMessage.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.string
};

FormMessage.defaultProps = {
  className: '',
  message: '',
  type: 'error'
};

export default FormMessage;
