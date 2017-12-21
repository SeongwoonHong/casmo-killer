import React, { Component } from 'react';
import axios from 'axios';

import SpanAnimatedText from 'sharedComponents/SpanAnimatedText';
import PlainBtn from 'sharedComponents/PlainBtn';
import LoadingCircle from 'sharedComponents/LoadingCircle';
import FormMessage from 'sharedComponents/FormMessage';

import inputValidator from 'sharedUtils/inputValidator';

import './LocalAuth.scss';

class Login extends Component {

  constructor(props) {

    super(props);

    this.state = {
      type: 'login',
      email: '',
      password: '',
      message: '',
      isLoading: false,
      successMsg: '',
    };

  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.name]: inputValidator.trim(e.target.value) });
  };

  onSubmitHandler = (e) => {

    e.preventDefault();

    this.setState({ isLoading: true });

    if (this.state.type === 'login') {
      this.onLogin();
    } else {
      this.onRegister();
    }

  };

  async onLogin() {

    const { email, password } = this.state;

    if (inputValidator.isEmpty(email) || inputValidator.isEmpty(password)) {

      this.setState({
        isLoading: false,
        message: 'Please enter your email and password.'
      });

    } else {

      this.setState({ message: '' });

      try {

        const { data } = await axios.post('/api/user/signin/local', {
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

    let message = '';

    if (inputValidator.isEmpty(email)) {
      message = 'Please enter your email.';
    } else if (!inputValidator.isEmail(email)) {
      message = 'The provided email address is not valid.';
    } else {
      try {
        // simply check if the email's been taken
        const { data } = await axios.get(`/api/user/validate/email/${email}`);
        if (data.isDuplicate) {
          message = 'The email address is already registered.';
        }
      } catch (error) {
        console.error(error.response.error);
        ({ message } = error.response.data);
      }
    }

    if (message.length > 0) {
      this.setState({ isLoading: false, message });
    } else {
      this.onRegisterRequest(email);
    }

  }

  async onRegisterRequest(email) {

    try {

      const { data } = await axios.post('/api/user/signup/request', { email });

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

  };

  typeToggle = () => {
    this.setState({
      type: this.state.type === 'login'
        ? 'register'
        : 'login'
    });
  };

  render() {

    const isLogin = this.state.type === 'login';
    const formText = isLogin ? 'Log In' : 'Sign Up';

    return (
      <div className="local-auth">
        <SpanAnimatedText text={ `${formText} With Email` } animateAtDidMount />
        <form onSubmit={ this.onSubmitHandler } noValidate>
          <FormMessage message={ this.state.message } />
          <FormMessage message={ this.state.successMsg } success="true" />
          {
            !this.state.successMsg
              ? (
                <div className="input-field">
                  <i className="material-icons prefix">email</i>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email Address"
                    disabled={ this.state.isLoading }
                    onChange={ this.onChangeHandler }
                    value={ this.state.email } />
                </div>
              )
              : null
          }
          {
            isLogin
              ? (
                <div className="input-field">
                  <i className="material-icons prefix">lock</i>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    disabled={ this.state.isLoading }
                    onChange={ this.onChangeHandler }
                    value={ this.state.password } />
                </div>
              )
              : null
          }
          {
            this.state.successMsg
              ? (
                <button
                  className="btn"
                  onClick={ this.props.closeModal }>
                  Close
                </button>
              )
              : (
                <button
                  type="submit"
                  className="btn"
                  disabled={ this.state.isLoading }>
                  {
                    this.state.isLoading
                      ? <LoadingCircle color="#004D40" />
                      : formText
                  }
                </button>
              )
          }
        </form>
        <div className="other-options">
          <PlainBtn onClick={ this.typeToggle }>
            { `${!isLogin ? 'Log In' : 'Sign Up'} ${isLogin ? 'For Free' : 'With Email'}` }
          </PlainBtn>
          <PlainBtn>
            Forgot Your Password?
          </PlainBtn>
        </div>
      </div>
    );

  }

}

export default Login;
