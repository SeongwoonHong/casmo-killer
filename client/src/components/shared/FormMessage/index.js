import React from 'react';
import classnames from 'classnames';

import './formMessage.scss';

const FormMessage = ({ message, success = false }) => {
  if (message.length > 0) {
    return (
      <div className={ classnames('submit-message', { success })}>
        <p>{ message }</p>
      </div>
    );
  }
  return null;
};

export default FormMessage;
