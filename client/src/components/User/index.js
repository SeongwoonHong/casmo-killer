import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Register from './Register';
import MyAccount from './MyAccount';
import UserVerify from './Verify/Verify';

class UserWrapper extends Component {

  render() {
    return (
      <div className="user">
        <Switch>
          <Route path="/user/verify/:token" component={ UserVerify } />
          <Route path="/user/register" component={ Register } />
          <Route path="/user/settings" component={ MyAccount } />
        </Switch>
      </div>
    );
  }

}

export default UserWrapper;
