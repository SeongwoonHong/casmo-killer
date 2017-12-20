import React, { Component } from 'react';
import axios from 'axios';

import SpanAnimatedText from 'sharedComponents/SpanAnimatedText';
import LoadingCircle from 'sharedComponents/LoadingCircle';

import inputValidator from 'sharedUtils/inputValidator';

import './Register.scss';

class Login extends Component {

  constructor(props) {

    super(props);

    this.state = {
      username: props.auth.username
        ? props.auth.username.replace(/\s/g, '')
        : '',
      avatar: props.auth.avatar || null,
      message: [],
      isLoading: false
    };

  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.name]: inputValidator.trim(e.target.value) });
  };

  onSubmitHandler = (e) => {

    e.preventDefault();
    this.setState({ isLoading: true });
    this.onRegistrationSubmit();

  };

  onImageUpload = (e) => {

    const reader = new FileReader();
    const image = e.target.files[0];
    console.log(image.size);

    reader.onloadend = () => {
      this.setState({ avatar: reader.result });
    };

    reader.readAsDataURL(image);

  };

  async onRegistrationSubmit() {

    const { auth, onSuccess } = this.props;
    const { username, avatar } = this.state;

    const isSocial = auth.strategy !== 'local' && auth.strategy !== null;

    const messages = [];

    if (inputValidator.isEmpty(username)) {

      messages.push('Please enter your username.');

    } else if (username.length < 4) {

      messages.push('Username must be more than 4 characters.');

    } else if (username.length > 20) {

      messages.push('Username must be less than 20 characters.');

    } else if (inputValidator.hasWhiteSpace(username)) {

      messages.push('Username cannot have any space between words.');

    } else if (!inputValidator.isUsername(username)) {

      messages.push('Username cannot have special characters.');

    } else {

      try {

        // simply check if the username's been taken
        const { data } = await axios.get(`/api/user/validate/username/${username}`);

        if (data.isDuplicate) {
          messages.push('The username is already registered.');
        }

      } catch (error) {
        console.error(error.response.data.error);
        messages.push(error.response.data.message);
      }

    }

    if (messages.length > 0) {

      this.setState({
        isLoading: false,
        message: messages
      });

    } else {

      this.setState({ message: [] });

      // need to use formData for uploading avatar img
      const userData = new FormData();

      userData.append('email', auth.email);
      userData.append('username', username);

      if (avatar) {
        userData.append('avatar', avatar);
      }

      if (auth.strategy !== null) {
        userData.append('strategy', auth.strategy);
        userData.append('socialId', auth.social.id);
        userData.append('socialToken', auth.social.accessToken);
      } else {
        userData.append('password', auth.password);
      }

      try {

        const endPoint = `/api/user/signup/${isSocial ? 'social' : 'local'}`;
        const { data } = await axios.post(endPoint, userData);

        this.setState({ isLoading: false });

        // registration success
        onSuccess(data);

      } catch (error) {

        // registration failure with messages
        console.error(error.response.data.error);
        this.setState({
          isLoading: false,
          message: [error.response.data.message]
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
        <form
          noValidate
          onSubmit={ this.onSubmitHandler }>
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
          <div className="input-field for-username">
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
