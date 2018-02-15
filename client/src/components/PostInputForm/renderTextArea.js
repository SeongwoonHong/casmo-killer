import React from 'react';

const renderField = ({
  input, label, type, fieldClass, meta: {
    error
  }
}) => (
  <div className="input-field">
    <textarea
      {...input}
      className="materialize-textarea validate"
      type={type}
      id={input.name}
    />
    <label htmlFor={input.name} data-error={error} className={fieldClass} />
  </div>
);

export default renderField;
