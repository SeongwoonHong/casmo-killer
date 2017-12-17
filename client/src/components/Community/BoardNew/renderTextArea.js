import React from 'react';
import TransitionGroup from 'react-transition-group-plus';
import classnames from 'classnames';
import SpanAnimatedText from 'sharedComponents/SpanAnimatedText';

const renderField = ({
  input, label, type, icon, meta: {
    error, touched
  }
}) => (
  <div className="input-field">
    <i className={classnames('material-icons prefix', { 'is-correct': input.name })}>{ icon }</i>
    <textarea
      {...input}
      className="materialize-textarea validate"
      type={type}
      id={input.name}
      data-length="200"
      required
    />
    <label htmlFor={input.name}>{label}</label>
    <TransitionGroup>
      {
        error && touched
        ? <SpanAnimatedText className="input-field-error-text" text={error} />
        : null
      }
    </TransitionGroup>
  </div>
);

export default renderField;
