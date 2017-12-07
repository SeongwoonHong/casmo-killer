import React, { Component } from 'react';
import axios from 'axios';

import SpanAnimatedText from 'sharedComponents/SpanAnimatedText';
import LoadingCircle from 'sharedComponents/LoadingCircle';

import inputValidator from 'sharedUtils/inputValidator';

import './Register.scss';

class Login extends Component {

  constructor(props) {

    super(props);

    this.initialState = {
      strategy: props.auth.strategy,
      username: props.auth.username || '',
      avatar: props.auth.avatar || '',
      social: props.social
        ? {
          id: props.social.id,
          accessToken: props.social.accessToken
        }
        : null,
      message: [],
      isLoading: false
    };

    this.state = this.initialState;

  }

  onChangeHandler = (e) => {

    this.setState({
      [e.target.name]: inputValidator.trim(e.target.value)
    });

  };

  onSubmitHandler = (e) => {

    e.preventDefault();

    const { auth } = this.props;

    this.setState({
      isLoading: true
    });

    this.onLocalRegister(auth.strategy);

  };

  onImageUpload = (e) => {

    const reader = new FileReader();
    const image = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        avatar: reader.result
      });
    };

    reader.readAsDataURL(image);

  };

  async onLocalRegister(isSocial) {

    const { auth, onSuccess } = this.props;

    const {
      username,
      avatar
    } = this.state;

    const messages = [];

    if (inputValidator.isEmpty(username)) {

      messages.push('Please enter your username.');

    } else if (this.state.username.length < 4) {

      messages.push('Username must be more than 4 characters.');

    } else if (this.state.username.length > 20) {

      messages.push('Username must be less than 20 characters.');

    } else if (!inputValidator.isUsername(username)) {

      messages.push('Username cannot have special characters.');

    } else {

      const { data } = await axios.get(`/api/user/validate/username/${username}`);

      if (data.isDuplicate) {
        messages.push('The username is already registered.');
      }

    }

    if (messages.length > 0) {

      this.setState({
        isLoading: false,
        message: messages
      });

    } else {

      this.setState({
        message: this.initialState.message
      });

      // const userData = new FormData();
      //
      // userData.append('email', auth.email);
      // userData.append('username', username);
      // userData.append('avatar', avatar || '');
      //
      // if (isSocial) {
      //   userData.append('strategy', auth.strategy);
      //   userData.append('social', auth.social);
      // } else {
      //   userData.append('password', auth.password);
      // }

      const userData = isSocial
        ? {
          strategy: auth.strategy,
          email: auth.email,
          username,
          avatar,
          social: auth.social
        }
        : {
          email: auth.email,
          password: auth.password,
          username,
          avatar
        };

      try {

        const { data } = await axios.post(`/api/user/signup/${isSocial ? 'social' : 'local'}`, userData);

        this.setState({
          isLoading: false
        });

        onSuccess(data);

      } catch (error) {

        this.setState({
          isLoading: false,
          message: [error.response.data]
        });

      }

    }

  }

  render() {

    const { authType } = this.props;

    const isLogin = authType === 'login';
    const formText = isLogin ? 'Log In' : 'Sign Up';

    return (
      <div className="local-auth register-form">
        <SpanAnimatedText
          text="Almost done !!!"
          animateAtDidMount
        />
        <form onSubmit={ this.onSubmitHandler } noValidate>

          {
            this.state.message.length > 0
              ? (
                this.state.message.map((msg) => {
                  return (
                    <div
                      key={ msg.length }
                      className="submit-message">
                      <p>{ msg }</p>
                    </div>
                  );
                })
              )
              : null
          }

          <div className="input-field">
            <i className="material-icons prefix">person</i>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              disabled={ this.state.isLoading }
              onChange={ this.onChangeHandler }
              value={ this.state.username } />
            <label htmlFor="username" className="active">Username</label>
          </div>
          <div className="file-field input-field">
            <i className="material-icons prefix">face</i>
            <div className="btn">
              <input
                type="file"
                accept="image/*"
                onChange={ this.onImageUpload } />
            </div>
            <div className="file-path-wrapper">
              <input
                type="text"
                placeholder="Upload a profile picture"
                className="file-path validate" />
            </div>
            <label htmlFor="avatar" className="active">Profile Picture</label>
          </div>
          {
            this.state.avatar
              ? (
                <div className="avatar-preview">
                  <span>Profile Picture Preview</span>
                  <div style={ { backgroundImage: `url(${this.state.avatar})` } } />
                </div>
              )
              : null
          }

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

        </form>

      </div>

    );

  }

}

export default Login;
