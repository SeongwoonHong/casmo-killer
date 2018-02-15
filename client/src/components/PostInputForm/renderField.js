import React from 'react';

const renderField = ({
  input, label, type, fieldClass, meta: {
    error
  }
}) => (
  <div className="input-field">
    <input {...input} className="validate" type={type} id={input.name} required />
    <label htmlFor={input.name} data-error={error} className={fieldClass}>{label}
    </label>
  </div>
);

export default renderField;
