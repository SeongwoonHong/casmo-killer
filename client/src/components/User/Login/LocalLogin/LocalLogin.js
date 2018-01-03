import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { validateEmail, trim } from 'sharedUtils/inputValidators';

import LoadingOverlay from 'sharedComponents/LoadingOverlay';
import FormMessage from 'sharedComponents/FormMessage';

import './LocalLogin.scss';

class LocalLogin extends Component {

  constructor(props) {

    super(props);

    this.state = {
      email: '',
      password: '',
      message: '',
      isLoading: false,
      successMsg: '',
    };

  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.name]: trim(e.target.value) });
  };

  onSubmitHandler = (e) => {

    e.preventDefault();

    this.setState({ isLoading: true });

    if (this.props.isLogin) {
      this.onLogin();
    } else {
      this.onRegister();
    }

  };

  async onLogin() {

    const { email, password } = this.state;

    if (email.length === 0 || password.length === 0) {

      this.setState({
        isLoading: false,
        message: 'Please enter your email and password.'
      });

    } else {

      this.setState({ message: '' });

      try {

        const { data } = await axios.post('/api/auth/login/local', {
          email, password
        });

        this.props.onSuccess(data.user);

      } catch (error) {

        console.error(error.response.data.error);
        this.setState({
          isLoading: false,
          message: error.response.data.message
        });

      }

    }

  }

  async onRegister() {

    const { email } = this.state;

    const message = await validateEmail(email);

    if (message.length > 0) {

      this.setState({ isLoading: false, message });

    } else {

      try {

        const { data } = await axios.post('/api/auth/request/verification', { email });

        this.setState({
          isLoading: false,
          message: '',
          successMsg: data.message
        });

      } catch (error) {

        // TODO: hook up an error message regarding sending out verification email
        console.error(error);
        this.setState({
          isLoading: false,
          message: error.response.data.message,
          successMsg: ''
        });

      }

    }

  }

  render() {

    const { isLogin, redirectUrl } = this.props;
    const formText = isLogin ? 'Log In' : 'Sign Up';

    return (
      <div className="user-form-box user-login-local">
        <LoadingOverlay
          isVisible={ this.state.isLoading }
          overlayColor="rgba(256,256,256,.75)"
          circleColor="#1F4B40" />
        <div className="user-form-header">
          <h3>{ `${formText} With Email` }</h3>
        </div>
        <form noValidate onSubmit={ this.onSubmitHandler }>
          <FormMessage message={ this.state.message } />
          {
            !this.state.successMsg
              ? (
                <div className="user-form-fields">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email Address"
                    disabled={ this.state.isLoading }
                    onChange={ this.onChangeHandler }
                    value={ this.state.email } />
                  <p>This email is linked to your account.</p>
                </div>
              )
              : (
                <FormMessage
                  message={ this.state.successMsg }
                  type="success" />
              )
          }
          {
            isLogin
              ? (
                <div className="user-form-fields">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    disabled={ this.state.isLoading }
                    onChange={ this.onChangeHandler }
                    value={ this.state.password } />
                  <p>Password must be between 4 and 20 characters.</p>
                </div>
              )
              : null
          }
          {
            this.state.successMsg
              ? (
                <Link to={ redirectUrl } className="user-form-button">
                  Go Back
                </Link>
              )
              : (
                <button
                  type="submit"
                  className="user-form-button"
                  disabled={ this.state.isLoading }>
                  { formText }
                </button>
              )
          }
        </form>
        <div className="other-options">
          <Link to={ `/user/auth/${isLogin ? 'signup' : 'login'}` }>
            {
              isLogin
                ? 'Sign Up For Free'
                : 'Log In With Email'
            }
          </Link>
          <Link to="/">
            Forgot Your Password?
          </Link>
        </div>
      </div>
    );

  }

}

export default LocalLogin;
