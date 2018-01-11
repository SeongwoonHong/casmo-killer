import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import * as actions from 'actions';

import PrivateRoute from 'sharedComponents/PrivateRoute';

import Login from './LogIn';
import Register from './Register';
import Recover from './Recover';
import Reset from './Reset';
import MyAccount from './MyAccount';
import Delete from './Delete';
import ErrorPage from '../ErrorPage';

import './User.scss';

class User extends Component {

  render() {

    const { user, registerRedirectUrl } = this.props;

    return (
      <div className="User">
        <Switch>
          <Route path="/user/auth/:type" component={ Login } />
          <Route path="/user/register/:token?" component={ Register } />
          <Route path="/user/recover" component={ Recover } />
          <Route path="/user/reset/:token?" component={ Reset } />
          <PrivateRoute
            path="/user/settings/:token?"
            isLoggedIn={ user.isLoggedIn }
            component={ MyAccount }
            onEnter={ url => registerRedirectUrl(url) } />
          <PrivateRoute
            path="/user/delete"
            isLoggedIn={ user.isLoggedIn }
            component={ Delete }
            onEnter={ url => registerRedirectUrl(url) } />
          <Route component={ ErrorPage } />
        </Switch>
      </div>
    );
  }

}

export default connect(
  state => ({
    user: state.user
  }),
  dispatch => ({
    registerRedirectUrl: url => dispatch(actions.registerRedirectUrl(url))
  })
)(User);
