import React from 'react';
import PropTypes from 'prop-types';

import { trim } from '@sharedUtils/inputValidators';

import './UserInputField.scss';

const inputType = (name) => {

  switch (name) {

    case 'password':
      return 'password';

    case 'email':
      return 'email';

    default:
      return 'text';

  }

};

const placeholder = (type) => {

  switch (type) {

    case 'email':
      return 'Email Address';

    case 'password':
      return 'Password';

    case 'displayName':
      return 'Display Name';

    default:
      return '';
  }

};

const messages = (type) => {

  switch (type) {

    case 'email':
      return 'This email is linked to your account.';

    case 'password':
      return 'Password must be between 6 and 20 characters.';

    case 'displayName':
      return 'Display name must be between 4 and 20 characters with no space.';

    default:
      return '';
  }

};

const UserInputField = (props) => {
  if (props.isVisible) {
    return (
      <div className="User__form__fields">
        <label
          htmlFor={ props.name }
          className="User__form__fields__label">
          { props.title || placeholder(props.name) }
        </label>
        <input
          className="User__form__fields__input"
          type={ props.type || inputType(props.name) }
          id={ props.name }
          name={ props.name }
          placeholder={ props.placeholder || placeholder(props.name) }
          onChange={ (e) => {
            props.onChange({
              name: e.target.name,
              value: trim(e.target.value)
            });
          } }
          value={ props.value }
          disabled={ props.disabled } />
        <p className="User__form__fields__message">
          { props.message || messages(props.name) }
        </p>
        {
          props.children
            ? props.children
            : null
        }
      </div>
    );
  }
  return null;
};

UserInputField.propTypes = {
  isVisible: PropTypes.bool,
  title: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  message: PropTypes.string,
  children: PropTypes.any,
};

UserInputField.defaultProps = {
  isVisible: true,
  title: '',
  type: '',
  placeholder: '',
  disabled: false,
  message: '',
  children: null
};

export default UserInputField;
