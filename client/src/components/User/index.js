import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import RequireAuthentication from 'sharedComponents/RequireAuthentication';

import './User.scss';

import Login from './LogIn';
import Register from './Register';
import MyAccount from './MyAccount';
import UserVerify from './Verify/Verify';

class User extends Component {

  render() {
    return (
      <div className="User">
        <Switch>
          <Route path="/user/auth/:type" component={ Login } />
          <Route path="/user/verify/:token" component={ UserVerify } />
          <Route path="/user/register" component={ Register } />
          <Route path="/user/settings/:token?" component={ RequireAuthentication(MyAccount, '/user/auth/login') } />
        </Switch>
      </div>
    );
  }

}

export default User;
