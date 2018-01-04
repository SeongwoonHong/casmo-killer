import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import * as actions from 'actions';

import PrivateRoute from 'sharedComponents/PrivateRoute';

import './User.scss';

import Login from './LogIn';
import Register from './Register';
import MyAccount from './MyAccount';
import UserVerify from './Verify/Verify';

class User extends Component {

  render() {

    const { user, registerRedirectUrl } = this.props;

    return (
      <div className="User">
        <Switch>
          <Route path="/user/auth/:type" component={ Login } />
          <Route path="/user/verify/:token" component={ UserVerify } />
          <Route path="/user/register" component={ Register } />
          <PrivateRoute
            path="/user/settings/:token?"
            isLoggedIn={ user.isLoggedIn }
            component={ MyAccount }
            onEnter={ url => registerRedirectUrl(url) } />
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
