import React from 'react';
import RichTextEditor from '../RichTextEditor/RichTextEditor';

const renderField = ({
  input, label, type, fieldClass, meta: {
    error
  }
}) => (
  <div className="input-field">
    <RichTextEditor {...input} className="materialize-textarea validate" type={type} id={input.name} />
    <label htmlFor={input.name} data-error={error} className={fieldClass} />
  </div>
);

export default renderField;
