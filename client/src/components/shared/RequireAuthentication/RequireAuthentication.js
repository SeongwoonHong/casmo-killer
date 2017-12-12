import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export default function (ComposedComponent, route) {
  class RequireAuthentication extends Component {

    componentWillMount = () => {
      if (!this.props.user.username) {
        Materialize.toast($('<span style="color: red">Log in is required</span>'), 3000, 'rounded');
        this.props.history.push(route);
      }
    }
    componentWillUpdate = (nextProps) => {
      if (!nextProps.user.username) {
        Materialize.toast($('<span style="color: red">Log in is required</span>'), 3000, 'rounded');
        this.props.history.push(route);
      }
    }
    render() {
      return (
        <ComposedComponent {...this.props} />
      );
    }
  }
  function mapStateToProps(state) {
    return {
      user: state.user
    };
  }
  return connect(mapStateToProps)(withRouter(RequireAuthentication));
}
