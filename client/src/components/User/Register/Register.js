import React, { Component } from 'react';
import axios from 'axios';

import LoadingOverlay from 'sharedComponents/LoadingOverlay';
import FormMessage from 'sharedComponents/FormMessage';

import {
  trim,
  validateImg,
  validateDisplayName,
  validatePassword
} from 'sharedUtils/inputValidators';

import './Register.scss';

class Register extends Component {

  constructor(props) {

    super(props);

    this.state = {
      displayName: {
        value: props.auth.displayName || '',
        message: ''
      },
      password: {
        value: '',
        message: ''
      },
      avatar: {
        value: props.auth.avatar || '',
        message: ''
      },
      errorMsg: '',
      isLoading: false
    };

  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: {
        ...this.state[e.target.name],
        value: trim(e.target.value)
      }
    });
  };

  onSubmitHandler = async (e) => {

    this.setState({ isLoading: true });

    e.preventDefault();

    const { displayName, password } = this.state;

    const errorMsg = {
      forDisplayName: '',
      forPassword: ''
    };

    errorMsg.forDisplayName = await validateDisplayName(displayName.value);

    this.setState({
      displayName: {
        ...this.state.displayName,
        message: errorMsg.forDisplayName || ''
      }
    });

    if (this.props.auth.strategy === 'local') {
      errorMsg.forPassword = validatePassword(password.value);
      this.setState({
        password: {
          ...this.state.password,
          message: errorMsg.forPassword
        }
      });
    }

    if (
      errorMsg.forDisplayName.length === 0 &&
      errorMsg.forPassword.length === 0
    ) {
      this.submitRegister();
    } else {
      this.setState({ isLoading: false });
    }


  };

  onImageUpload = (e) => {

    this.setState({ isLoading: true });

    const reader = new FileReader();
    const image = e.target.files[0];

    reader.onloadend = () => {
      if (image.size > 5000000) {
        this.setState({
          avatar: {
            ...this.state.avatar,
            message: 'File is too big.'
          },
          isLoading: false
        });
      } else if (!validateImg(reader.result)) {
        this.setState({
          avatar: {
            ...this.state.avatar,
            message: 'File format is not supported.'
          },
          isLoading: false
        });
      } else {
        this.setState({
          avatar: {
            value: reader.result,
            message: ''
          },
          isLoading: false
        });
      }
    };

    reader.readAsDataURL(image);

  };

  submitRegister = async () => {

    const {
      strategy, email, socialId, socialToken
    } = this.props.auth;
    const {
      displayName, avatar, password
    } = this.state;

    const isLocal = strategy === 'local';
    const userData = new FormData();

    userData.append('strategy', strategy);
    userData.append('email', email);
    userData.append('displayName', displayName.value);

    if (avatar.value) {
      userData.append('avatar', avatar.value);
    }

    if (isLocal) {
      userData.append('password', password.value);
    } else {
      userData.append('socialId', socialId);
      userData.append('socialToken', socialToken);
    }

    try {

      const apiUrl = `/api/auth/register/${isLocal ? 'local' : 'social'}`;
      const { data } = await axios.post(apiUrl, userData);

      this.props.loginSuccess(data.user);

      const { isLoggedIn } = this.props.user;
      const { redirectUrl } = this.props.auth;

      if (isLoggedIn) {
        this.props.history.push(redirectUrl);
      }

    } catch (error) {

      console.error(error.response.data.error);
      this.setState({
        errorMsg: error.response.data.message,
        isLoading: false
      });

    }

  };

  render() {

    const {
      displayName, password, avatar, isLoading, errorMsg
    } = this.state;

    const { auth } = this.props;

    const avatarPreview = (avatarState) => {
      if (avatarState.value) {
        return (
          <img
            className="circle avatar-img"
            alt="user-avatar"
            src={ avatarState.value }
          />
        );
      }
      return <span>No Image</span>;
    };

    return (
      <form
        noValidate
        onSubmit={ this.onSubmitHandler }
        className="user-form-box registration-form">
        <LoadingOverlay
          isVisible={ isLoading }
          overlayColor="rgba(256,256,256,.75)"
          circleColor="#1F4B40" />
        <div className="user-form-header">
          <h3>User Registration</h3>
          <p>Please fill in the following fields to complete your registration.</p>
        </div>
        <FormMessage message={ errorMsg } />
        <div className="user-form-fields">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={ email || '' }
            disabled="true" />
          <p>This email is linked to your account.</p>
        </div>
        <FormMessage message={ displayName.message } />
        <div className="user-form-fields">
          <label htmlFor="displayName">Display Name</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={ displayName.value }
            onChange={ this.onChangeHandler } />
          <p>Display name must be between 4 and 20 characters with no space.</p>
        </div>
        <FormMessage message={ password.message } />
        {
          auth.strategy === 'local'
            ? (
              <div className="user-form-fields">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={ password.value }
                  onChange={ this.onChangeHandler } />
                <p>Password must be between 6 and 20 letters.</p>
              </div>
            )
            : null
        }
        <FormMessage message={ avatar.message } />
        <div className="user-form-fields">
          <label>Profile Picture</label>
          <div className="avatar-preview">
            <div className="avatar-wrapper">
              { avatarPreview(avatar) }
            </div>
            <input
              type="file"
              accept="image/*"
              id="profilePicture"
              onChange={ this.onImageUpload } />
            <label htmlFor="profilePicture">
              <span className="user-form-button">
                Upload New Picture
              </span>
              <span>Max 5mb, JPG, or PNG</span>
            </label>
          </div>
        </div>
        <button
          className="user-form-button"
          type="submit">
          Submit
        </button>
      </form>
    );

  }

}

export default Register;
