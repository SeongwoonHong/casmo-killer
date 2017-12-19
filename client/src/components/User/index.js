import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import MyAccount from './MyAccount';

class UserWrapper extends Component {

  render() {
    return (
      <div className="user">
        <Switch>
          <Route path="/user/account" component={ MyAccount } />
        </Switch>
      </div>
    );
  }

}

export default UserWrapper;
