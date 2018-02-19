import React from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from '../RichTextEditor/RichTextEditor';

const ReduxFormField = ({
  input, label, type, mode, fieldClass, meta: {
    error
  }
}) => (
  <div className="input-field">
    {
      mode === 'field' &&
      <input {...input} className="validate field" type={type} id={input.name} required />
    }
    {
      mode === 'rte' &&
      <RichTextEditor {...input} className="textarea validate field" type={type} id={input.name} />
    }
    {
      mode === 'textarea' &&
      <textarea
        {...input}
        className="textarea validate field-textarea"
        type={type}
        id={input.name}
      />
    }
    <label htmlFor={input.name} data-error={error} className={fieldClass}>
      {
        mode !== 'rte' && label
      }
    </label>
  </div>
);

ReduxFormField.defaultProps = {
  mode: 'field'
};

ReduxFormField.propTypes = {
  mode: PropTypes.string
};

export default ReduxFormField;
