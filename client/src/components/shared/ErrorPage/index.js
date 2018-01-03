import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './ErrorPage.scss';

const ErrorPage = (props) => {
  return (
    <div className="Error-page">
      <h2>(._.)?</h2>
      <div className="error-message">
        <i className="material-icons">format_quote</i>
        <h3>{ props.title }</h3>
        <i className="material-icons">format_quote</i>
      </div>
      <p>
        { props.message }
      </p>
      <Link to="/">Return to Homepage</Link>
    </div>
  );
};

ErrorPage.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string
};

ErrorPage.defaultProps = {
  title: 'Page Not Found',
  message: 'The page you requested cannot be found.'
};

export default ErrorPage;
