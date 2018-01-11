import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { validateEmail } from 'sharedUtils/inputValidators';

import FormMessage from 'sharedComponents/FormMessage';

import UserPageContainer from '../../shared/UserPageContainer';
import UserInputField from '../../shared/UserInputField';

import './LocalLogin.scss';

const initialState = {
  isLoading: false,
  email: '',
  password: '',
  message: '',
  successMsg: '',
};

class LocalLogin extends Component {

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isLogin !== nextProps.isLogin) {
      this.setState(initialState);
    }
  }

  onChangeHandler = (e) => {
    this.setState({ [e.name]: e.value });
  };

  onSubmitHandler = () => {

    const { isLogin } = this.props;

    this.setState({
      isLoading: true,
      message: '',
      successMsg: ''
    });

    if (isLogin) {
      this.onLogin();
    } else {
      this.onRegister();
    }

  };

  async onLogin() {

    const { onSuccess } = this.props;
    const { email, password } = this.state;

    if (email.length === 0 || password.length === 0) {

      this.setState({
        isLoading: false,
        message: 'Please enter your email and password.'
      });

    } else {

      try {

        const { data } = await axios.post('/api/auth/login/local', {
          email, password
        });

        if (data && data.user) {

          onSuccess(data.user);

        } else {

          this.setState({
            isLoading: false,
            message: 'Failed to communicate with the server.'
          });

        }

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

      this.setState({
        isLoading: false,
        message
      });

    } else {

      try {

        const { data } = await axios.post('/api/auth/request/verification', {
          email
        });

        if (data && data.message) {

          this.setState({
            isLoading: false,
            successMsg: data.message
          });

        } else {

          this.setState({
            isLoading: false,
            message: 'Failed to communicate with the server.'
          });

        }

      } catch (error) {

        console.error(error);
        this.setState({
          isLoading: false,
          message: error.response.data.message
        });

      }

    }

  }

  render() {

    const {
      isLoading, email, password, message, successMsg
    } = this.state;

    const { isLogin, redirectUrl } = this.props;

    const formText = isLogin ? 'Log In' : 'Sign Up';

    return ([
      <UserPageContainer
        key={ 0 }
        className="Local-login"
        formTitle={ `${formText} with Email`}
        isLoading={ isLoading }
        onSubmit={ this.onSubmitHandler }
        button={
          successMsg.length > 0
            ? (
              <Link
                to={ redirectUrl }
                className="user-form-button">
                Go Back
              </Link>
            )
            : (
              <button
                type="submit"
                className="user-form-button">
                { formText }
              </button>
            )
        }>
        <FormMessage message={ message } />
        <UserInputField
          isVisible={ !successMsg.length > 0 }
          type="email"
          name="email"
          onChange={ this.onChangeHandler }
          value={ email } />
        <FormMessage
          message={ successMsg }
          type="success" />
        <UserInputField
          isVisible={ isLogin }
          type="password"
          name="password"
          onChange={ this.onChangeHandler }
          value={ password } />
      </UserPageContainer>,
      <div
        key={ 1 }
        className="other-options">
        <Link to={ `/user/auth/${isLogin ? 'signup' : 'login'}` }>
          {
            isLogin
              ? 'Sign Up For Free'
              : 'Log In With Email'
          }
        </Link>
        <Link to="/user/recover">
          Forgot Your Password?
        </Link>
      </div>
    ]);

  }

}

export default LocalLogin;
