import React, { Component } from 'react';

import * as storage from 'sharedUtils/storage';

import './Login.scss';

import SocialLogin from './SocialLogin/SocialLogin';
import LocalLogin from './LocalLogin/LocalLogin';

class Login extends Component {

  componentWillReceiveProps(nextProps) {

    const { auth, user, history } = nextProps;

    if (user.isLoggedIn) {
      history.push(auth.redirectUrl);
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

    const user = await storage.set('ckUser', userInfo);

    this.props.loginSuccess(user);

  };

  render() {

    const isLogin = this.props.match.params.type === 'login';

    return (
      <div className="Login">
        <h2 className="user-page-title">
          {
            isLogin
              ? 'Login to your account'
              : 'Sign up for free'
          }
          <i className="material-icons">
            {
              isLogin
                ? 'lock'
                : 'mode_edit'
            }
          </i>
        </h2>
        <SocialLogin
          onRegister={ this.onSocialRegister }
          onSuccess={ this.onLoginSuccess } />
        <LocalLogin
          isLogin={ isLogin }
          redirectUrl={ this.props.auth.redirectUrl }
          onSuccess={ this.onLoginSuccess } />
      </div>
    );
  }

}

export default Login;
