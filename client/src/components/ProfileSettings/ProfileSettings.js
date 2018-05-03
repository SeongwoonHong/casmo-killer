import React, { Component } from 'react';
import { Prompt } from 'react-router-dom';
import axios from 'axios';

import * as storage from '@sharedUtils/storage';
import {
  validateEmail,
  validateDisplayName
} from '@sharedUtils/inputValidators';

import FormMessage from '@sharedComponents/FormMessage';
import AvatarUploader from '@sharedComponents/AvatarUploader';

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

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onImageUpload = this.onImageUpload.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);

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

  onChangeHandler(e) {
    this.setState({
      [e.name]: {
        ...this.state[e.name],
        value: e.value
      }
    });
  }

  onImageUpload(img) {

    this.setState({
      avatar: {
        value: img.value,
        message: img.message
      },
      isLoading: false
    });

  }

  async onSubmitHandler() {

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

  }

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
        <FormMessage
          message={ emailSuccessMsg }
          type="warning" />

        <FormMessage message={ email.message } />
        <UserInputField
          name="email"
          onChange={ this.onChangeHandler }
          value={ email.value || '' }
          disabled={ user.strategy !== 'local' } />

        <FormMessage
          message={ displayName.message } />
        <UserInputField
          name="displayName"
          title="Display Name"
          onChange={ this.onChangeHandler }
          value={ displayName.value || '' } />

        <FormMessage
          message={ avatar.message } />
        <AvatarUploader
          className="User__form__fields"
          avatar={ avatar }
          onChange={ this.onImageUpload } />

      </UserPageContainer>
    );

  }

}

export default ProfileSettings;
