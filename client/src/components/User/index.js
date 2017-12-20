import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import MyAccount from './MyAccount';
import UserVerify from './UserVerify/UserVerify';

class UserWrapper extends Component {

  render() {
    return (
      <div className="user">
        <Switch>
          <Route path="/user/account" component={ MyAccount } />
          <Route path="/user/verify/:token" component={ UserVerify } />
        </Switch>
      </div>
    );
  }

}

export default UserWrapper;
