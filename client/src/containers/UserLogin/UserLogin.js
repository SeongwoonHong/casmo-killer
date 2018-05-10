import React, { Component } from 'react';

import * as storage from '@sharedUtils/storage';
import FormMessage from '@sharedComponents/FormMessage';

import SocialLogin from '../../components/SocialLogin';
import LocalLogin from '../../components/LocalLogin';

import './UserLogin.scss';

class Login extends Component {

  componentWillReceiveProps(nextProps) {

    const { history, user } = nextProps;

    if (user.isLoggedIn) {

      history.replace(this.props.location && this.props.location.state
        ? this.props.location.state.from
        : '/'
      );

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

    const { location, match, auth } = this.props;

    const isLogin = match.params.type === 'login';
    const redirectUrl = location && location.state ? location.state.from : '/';

    return (
      <div className="Login">
        <h2 className="User__page__title">
          {
            isLogin
            ? 'Login to your account'
            : 'Sign up for free'
          }
          <i className="User__page__title__icons material-icons">
            {
              isLogin
              ? 'lock'
              : 'mode_edit'
            }
          </i>
        </h2>
        <FormMessage
          className="Login__message"
          message={ auth.message } />
        <SocialLogin
          isLogin={ isLogin }
          onRegister={ this.onSocialRegister }
          onSuccess={ this.onLoginSuccess } />
        <LocalLogin
          isLogin={ isLogin }
          redirectUrl={ redirectUrl }
          onSuccess={ this.onLoginSuccess } />
      </div>
    );
  }

}

export default Login;
