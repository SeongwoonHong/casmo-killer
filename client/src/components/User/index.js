import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import * as actions from 'actions';

import PrivateRoute from 'sharedComponents/PrivateRoute';

import './User.scss';

import Login from './LogIn';
import Verify from './Verify';
import Register from './Register';
import Recover from './Recover';
import Reset from './Reset';
import MyAccount from './MyAccount';
import Delete from './Delete';
import NotFound from '../NotFound';

class User extends Component {

  render() {

    const { user, registerRedirectUrl } = this.props;

    return (
      <div className="User">
        <Switch>
          <Route path="/user/auth/:type" component={ Login } />
          <Route path="/user/register" component={ Register } />
          <Route path="/user/recover" component={ Recover } />
          <Route path="/user/verify/:type/:token" component={ Verify } />
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
          <Route component={ NotFound } />
        </Switch>
      </div>
    );
  }

}


const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    registerRedirectUrl: url => dispatch(actions.registerRedirectUrl(url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
