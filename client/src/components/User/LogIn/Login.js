import React, { Component } from 'react';

import * as storage from 'sharedUtils/storage';
import FormMessage from 'sharedComponents/FormMessage';

import SocialLogin from './SocialLogin/SocialLogin';
import LocalLogin from './LocalLogin/LocalLogin';

import './Login.scss';

class Login extends Component {

  componentWillReceiveProps(nextProps) {

    const {
      history, auth, user, clearRedirectUrl
    } = nextProps;

    if (user.isLoggedIn) {

      const { redirectUrl } = auth;
      clearRedirectUrl();
      history.replace(redirectUrl);

    }

  }

  onSocialRegister = (userInfo) => {

    this.props.setUserForRegistration(userInfo);

    const { auth, history } = this.props;

    if (auth.email) {
      history.push('/user/register');
    }

  };

  onLoginSuccess = async (userInfo) => {

    try {
      const user = await storage.set('ckUser', userInfo);
      this.props.loginSuccess(user, true);
    } catch (error) {
      console.error(error);
    }

  };

  render() {

    const { match, auth } = this.props;

    const isLogin = match.params.type === 'login';
    const message = auth.redirectUrl !== '/' && isLogin
      ? 'Please log in to continue'
      : '';

    return (
      <div className="Login">
        <h2 className="user-page-title">
          { isLogin ? 'Login to your account' : 'Sign up for free' }
          <i className="material-icons">
            { isLogin ? 'lock' : 'mode_edit' }
          </i>
        </h2>
        <FormMessage message={ message } />
        <SocialLogin
          isLogin={ isLogin }
          onRegister={ this.onSocialRegister }
          onSuccess={ this.onLoginSuccess } />
        <LocalLogin
          isLogin={ isLogin }
          redirectUrl={ auth.redirectUrl }
          onSuccess={ this.onLoginSuccess } />
      </div>
    );
  }

}

export default Login;
