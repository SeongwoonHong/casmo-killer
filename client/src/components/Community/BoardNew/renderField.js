import React from 'react';
import TransitionGroup from 'react-transition-group-plus';
import classnames from 'classnames';
import SpanAnimatedText from '../../SpanAnimatedText/SpanAnimatedText';

const renderField = ({
  input, label, type, icon, meta: {
    error, touched
  }
}) => (
  <div className="input-field">
    <i className={classnames('material-icons prefix', { 'is-correct': input.name })}>{ icon }</i>
    <input {...input} className="validate" type={type} id={input.name} required />
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
