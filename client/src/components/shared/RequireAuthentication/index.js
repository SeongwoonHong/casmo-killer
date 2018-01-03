import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

export default function (ComposedComponent, route = '/') {
  class RequireAuthentication extends Component {

    componentWillMount() {
      this.props.registerRedirectUrl(this.props.location.pathname);
      if (!this.props.user.isLoggedIn) {
        this.props.history.push(route);
      }
    }

    render() {
      return (
        <ComposedComponent { ...this.props } />
      );
    }
  }

  const mapStateToProps = (state) => {
    return {
      auth: state.auth,
      user: state.user
    };
  };

  const mapDispatchToProps = (dispatch) => {
    return {
      registerRedirectUrl: url => dispatch(actions.registerRedirectUrl(url))
    };
  };

  return connect(mapStateToProps, mapDispatchToProps)(withRouter(RequireAuthentication));
}
