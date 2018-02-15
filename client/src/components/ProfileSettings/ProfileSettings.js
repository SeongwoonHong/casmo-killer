import React, { Component } from 'react';
import { Prompt } from 'react-router-dom';
import axios from 'axios';

import * as storage from '@sharedUtils/storage';
import {
  validateImg,
  validateEmail,
  validateDisplayName
} from '@sharedUtils/inputValidators';

import FormMessage from '@sharedComponents/FormMessage';

import UserPageContainer from '../UserPageContainer';
import UserInputField from '../UserInputField';

import './ProfileSettings.scss';

class ProfileSettings extends Component {

  constructor(props) {

    super(props);

    this.state = {
      isLoading: false,
      isSuccess: false,
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
      message: '',
      emailSuccessMsg: ''
    };

  }

  componentWillReceiveProps(nextProps) {

    const { email, displayName, avatar } = nextProps.user;

    this.setState({
      email: {
        ...this.state.email,
        value: email
      },
      displayName: {
        ...this.state.displayName,
        value: displayName
      },
      avatar: {
        ...this.state.avatar,
        value: avatar
      }
    });

  }

  onChangeHandler = (e) => {
    this.setState({
      [e.name]: {
        ...this.state[e.name],
        value: e.value
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

    let message = '';

    reader.onloadend = () => {

      if (image.size > 5000000) {
        message = 'File is too big.';
      } else if (!validateImg(reader.result)) {
        message = 'File format is not supported.';
      }

      this.setState({
        avatar: {
          value: message.length > 0
            ? this.state.avatar.value
            : reader.result,
          message
        },
        isLoading: false
      });

    };

    reader.readAsDataURL(image);

  };

  onSubmitHandler = async () => {

    this.setState({
      isLoading: true,
      message: '',
      emailSuccessMsg: ''
    });

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
      }
    });

    if (
      errorMsg.forEmail.length === 0 &&
      errorMsg.forDisplayName.length === 0 &&
      avatar.message.length === 0
    ) {

      userData.append('email', email.value);
      userData.append('displayName', displayName.value);

      if (avatar.value) {
        userData.append('avatar', avatar.value);
      }

      try {

        const { data } = await axios.put('/api/user/update/profile', userData);

        if (data && data.user) {

          this.setState({
            isSuccess: true,
            message: data.message,
            emailSuccessMsg: data.emailSuccessMsg
          });

          const user = await storage.set('ckUser', data.user);
          this.props.onSuccess(user);

        } else {

          this.setState({
            isSuccess: false,
            message: 'Failed to communicate with the server.'
          });

        }

      } catch (error) {
        console.error(error);
        this.setState({
          isSuccess: false,
          message: error.response.data.message
        });
      }

    }

    this.setState({ isLoading: false });

  };

  render() {

    const { user } = this.props;

    const {
      isLoading,
      isSuccess,
      email,
      displayName,
      avatar,
      message,
      emailSuccessMsg
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
      <UserPageContainer
        className="Profile-settings"
        isLoading={ isLoading }
        formTitle="Profile Settings"
        formMsg="Update your email, display name, and profile picture."
        onSubmit={ this.onSubmitHandler }
        disabled={ hasBeenEdited }>

        <Prompt
          when={ !hasBeenEdited }
          message="Are you fucking sure? Your information will be lost." />

        <FormMessage
          message={ message }
          type={ isSuccess ? 'success' : 'error '} />
        <FormMessage message={ emailSuccessMsg } type="warning" />

        <FormMessage message={ email.message } />
        <UserInputField
          name="email"
          onChange={ this.onChangeHandler }
          value={ email.value || '' }
          disabled={ user.strategy !== 'local' } />

        <FormMessage message={ displayName.message } />
        <UserInputField
          name="displayName"
          title="Display Name"
          onChange={ this.onChangeHandler }
          value={ displayName.value || '' } />

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

      </UserPageContainer>
    );

  }

}

export default ProfileSettings;
