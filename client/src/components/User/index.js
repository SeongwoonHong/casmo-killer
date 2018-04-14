import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import ErrorPage from '../../components/ErrorPage';
import Info from './Info';

import './User.scss';

class User extends Component {
  render() {
    return (
      <div className="User">
        <Switch>
          <Route path="/user/info/:userId" component={ Info } />
          <Route component={ ErrorPage } />
        </Switch>
      </div>
    );
  }
}

export default User;
