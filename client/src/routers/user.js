import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import * as actions from '@actions';

import PrivateRoute from '@sharedComponents/PrivateRoute';

import UserLogin from '../containers/UserLogin';
import UserRegister from '../containers/UserRegister';
import UserRecover from '../containers/UserRecover';
import UserReset from '../containers/UserReset';
import UserSettings from '../containers/UserSettings';
import Delete from '../containers/UserDelete';
import ErrorPage from '../components/ErrorPage';

// import Info from '../components/Info';

import '../components/User/User.scss';

class User extends Component {

  componentWillUnmount() {
    this.props.clearRedirectUrl();
  }

  render() {

    const { user, registerRedirectUrl } = this.props;

    return (
      <div className="User">
        <Switch>
          <Route path="/user/auth/:type" component={ UserLogin } />
          <Route path="/user/register/:token?" component={ UserRegister } />
          <Route path="/user/recover" component={ UserRecover } />
          <Route path="/user/reset/:token?" component={ UserReset } />
          <PrivateRoute
            path="/user/settings/:token?"
            isLoggedIn={ user.isLoggedIn }
            component={ UserSettings }
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
    user: state.user.user
  }),
  dispatch => ({
    clearRedirectUrl: () => dispatch(actions.clearRedirectUrl()),
    registerRedirectUrl: url => dispatch(actions.registerRedirectUrl(url))
  })
)(User);
