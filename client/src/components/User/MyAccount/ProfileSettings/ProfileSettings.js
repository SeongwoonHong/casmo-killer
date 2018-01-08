import React, { Component } from 'react';
import axios from 'axios';

import LoadingOverlay from 'sharedComponents/LoadingOverlay';
import FormMessage from 'sharedComponents/FormMessage';

import {
  trim,
  validateImg,
  validateEmail,
  validateDisplayName
} from 'sharedUtils/inputValidators';

import './ProfileSettings.scss';

class ProfileSettings extends Component {

  constructor(props) {

    super(props);

    this.state = {
      email: {
        value: props.user.email,
        message: ''
      },
      displayName: {
        value: props.user.displayName,
        message: ''
      },
      avatar: {
        value: props.user.avatar,
        message: ''
      },
      isLoading: false,
      successMsg: '',
      emailSuccessMsg: ''
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

  onImageUpload = (e) => {

    this.setState({
      avatar: {
        ...this.state.avatar,
        isLoading: true
      }
    });

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

  onSubmitHandler = async (e) => {

    e.preventDefault();

    this.setState({ isLoading: true });

    const {
      email, displayName, avatar
    } = this.state;

    const errorMsg = {
      forEmail: '',
      forDisplayName: ''
    };

    const userData = new FormData();

    errorMsg.forEmail = await validateEmail(email.value);
    errorMsg.forDisplayName = await validateDisplayName(displayName.value);

    this.setState({
      email: {
        ...this.state.email,
        message: errorMsg.forEmail
      },
      displayName: {
        ...this.state.displayName,
        message: errorMsg.forDisplayName
      },
      successMsg: ''
    });

    if (
      !errorMsg.forEmail.length &&
      !errorMsg.forDisplayName.length &&
      !avatar.message.length
    ) {

      userData.append('email', email.value);
      userData.append('displayName', displayName.value);

      if (avatar.value) {
        userData.append('avatar', avatar.value);
      }

      try {
        const { data } = await axios.put('/api/user/update/profile', userData);
        this.setState({
          successMsg: data.successMsg,
          emailSuccessMsg: data.emailSuccessMsg
        });
        this.props.onSuccess(data.user);
      } catch (error) {
        console.error(error);
      }
    } else {
      this.setState({
        email: {
          ...this.state.email,
          message: errorMsg.forEmail
        },
        displayName: {
          ...this.state.displayName,
          message: errorMsg.forDisplayName
        }
      });
    }

    this.setState({ isLoading: false });

  };

  render() {

    const { user } = this.props;

    const {
      email, displayName, avatar, isLoading, successMsg, emailSuccessMsg
    } = this.state;

    const hasBeenEdited = email.value === user.email
      && displayName.value === user.displayName
      && avatar.value === user.avatar;

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
      <div className="Profile-settings user-form-box">
        <LoadingOverlay
          isVisible={ isLoading }
          overlayColor="rgba(256,256,256,.75)"
          circleColor="#1F4B40" />
        <div className="user-form-header">
          <h3>Profile Settings</h3>
          <p>Update your email, display name, and profile picture.</p>
          <FormMessage message={ successMsg } type="success" />
        </div>
        <form
          noValidate
          onSubmit={ this.onSubmitHandler }
          className="user-form">
          <FormMessage message={ emailSuccessMsg } type="warning" />
          <FormMessage message={ email.message } />
          <div className="user-form-fields">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={ email.value || '' }
              disabled={ user.strategy !== 'local' }
              onChange={ this.onChangeHandler } />
            <p>This email is linked to your account.</p>
          </div>
          <FormMessage message={ displayName.message } />
          <div className="user-form-fields">
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={ displayName.value || '' }
              onChange={ this.onChangeHandler } />
            <p>This is the display name for your account.</p>
          </div>
          <FormMessage message={ avatar.message } />
          <div className="user-form-fields last-field">
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
            type="submit"
            className="user-form-button"
            disabled={ hasBeenEdited }>
            Save Changes
          </button>
        </form>
      </div>
    );

  }

}

export default ProfileSettings;
