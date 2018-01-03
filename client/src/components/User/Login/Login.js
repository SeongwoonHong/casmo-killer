import React, { Component } from 'react';

import * as storage from 'sharedUtils/storage';

import './Login.scss';

import LocalLogin from './LocalLogin/LocalLogin';
import SocialLogin from './SocialLogin/SocialLogin';

class Login extends Component {

  // need to redirect here even on first load
  // because user's logged-in state is loaded asynchronously
  componentWillReceiveProps(nextProps) {
    const { auth, user, history } = nextProps;
    if (user.isLoggedIn) {
      history.push(auth.redirectUrl);
    }
  }

  onSocialRegister = (userInfo) => {

    this.props.setUserForRegister(userInfo);

    const { auth, history } = this.props;

    if (auth.email) {
      history.push('/user/register');
    }

  };

  onLoginSuccess = async (userInfo) => {

    const user = await storage.set('ckUser', userInfo);
    this.props.loginSuccess(user);

  };

  render() {
    return (
      <div className="user-login">
        <SocialLogin
          onRegister={ this.onSocialRegister }
          onSuccess={ this.onLoginSuccess } />
        <LocalLogin
          isLogin={ this.props.match.params.type === 'login' }
          redirectUrl={ this.props.auth.redirectUrl }
          onSuccess={ this.onLoginSuccess } />
      </div>
    );
  }

}

export default Login;
