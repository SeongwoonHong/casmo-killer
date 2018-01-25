import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from 'actions';

import './ErrorPage.scss';

class ErrorPage extends Component {

  componentWillUnmount() {
    this.props.setErrorState();
  }

  render() {

    const { errorTitle, errorMsg, redirectUrl } = this.props.error;

    return (
      <div className="Error-page">
        <h2 className="error-title">(._.)?</h2>
        <div className="error-message">
          <i className="material-icons">format_quote</i>
          <h3>{ errorTitle.length > 0 ? errorTitle : 'Page Not Found' }</h3>
          <i className="material-icons">format_quote</i>
        </div>
        <p>
          { errorMsg.length > 0 ? errorMsg : 'The page you requested cannot be found.' }
        </p>
        <Link
          to={ redirectUrl.length > 0 ? redirectUrl : '/' }
          className="error-link">
          Return to Homepage
        </Link>
      </div>
    );

  }

}

function mapStateToProps(state) {
  return {
    error: state.error
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setErrorState: () => dispatch(actions.setErrorState())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ErrorPage);
