import React, { Component } from 'react';
import axios from 'axios';
import PlainBtn from 'sharedComponents/PlainBtn';
import LoadingCircle from 'sharedComponents/LoadingCircle';

import inputValidator from 'sharedUtils/inputValidator';

import './ProfileSettings.scss';

class ProfileSettings extends Component {

  constructor(props) {

    super(props);

    this.state = {
      email: {
        value: '',
        message: ''
      },
      username: {
        value: '',
        message: ''
      },
      avatar: {
        value: '',
        message: '',
        isLoading: false
      },
      isLoading: false,
      operationStatus: {
        isSuccess: false,
        message: ''
      }
    };

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      email: {
        ...this.state.email,
        value: nextProps.user.email
      },
      username: {
        ...this.state.username,
        value: nextProps.user.username
      },
      avatar: {
        ...this.state.avatar,
        value: nextProps.user.avatar
      }
    });
  }

  onErrorHandler = (target, message) => {
    this.setState({
      [target]: {
        ...this.state[target],
        message
      }
    });
  };

  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: {
        ...this.state[e.target.name],
        value: e.target.value
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
        this.onErrorHandler('avatar', 'File is too big.');
        this.setState({
          avatar: {
            ...this.state.avatar,
            isLoading: false
          }
        });
      } else {
        this.setState({
          avatar: {
            isLoading: false,
            value: reader.result,
            message: ''
          }
        });
      }
    };

    reader.readAsDataURL(image);

  };

  onSubmitHandler = async (e) => {

    e.preventDefault();

    this.setState({ isLoading: true });

    const {
      email,
      username,
      avatar
    } = this.state;

    let emailMessage = '';
    let usernameMessage = '';

    // TODO: definitely need to refactor input validations

    if (email.value !== this.props.user.email) {
      if (inputValidator.isEmpty(email.value)) {
        emailMessage = 'Please enter your email.';
      } else if (!inputValidator.isEmail(email.value)) {
        emailMessage = 'The provided email address is not valid.';
      } else {
        try {
          const { data } = await axios.get(`/api/user/validate/email/${email.value}`);
          if (data.isDuplicate) {
            emailMessage = 'The email address is already registered.';
          }
        } catch (error) {
          console.error(error.response.error);
          emailMessage = error.response.data.message;
        }
      }
    }

    if (username.value !== this.props.user.username) {
      if (inputValidator.isEmpty(username.value)) {
        usernameMessage = 'Please enter yxour username.';
      } else if (username.value.length < 4) {
        usernameMessage = 'Username must be more than 4 characters.';
      } else if (username.value.length > 20) {
        usernameMessage = 'Username must be less than 20 characters.';
      } else if (inputValidator.hasWhiteSpace(username.value)) {
        usernameMessage = 'Username cannot have any space between words.';
      } else if (!inputValidator.isUsername(username.value)) {
        usernameMessage = 'Username cannot have special characters.';
      } else {
        try {
          const { data } = await axios.get(`/api/user/validate/username/${username.value}`);
          if (data.isDuplicate) {
            usernameMessage = 'The username is already registered.';
          }
        } catch (error) {
          console.error(error.response.data.error);
          usernameMessage = error.response.data.message;
        }
      }
    }

    if (!emailMessage.length && !usernameMessage.length && !avatar.message.length) {
      try {
        const { data } = await axios.put('/api/user/update/all', {
          email: email.value,
          username: username.value,
          avatar: avatar.value
        });
        this.props.onSuccess(data);
      } catch (error) {
        console.error(error);
      }
      this.setState({ isLoading: false });
    } else {
      this.setState({
        email: {
          ...this.state.email,
          message: emailMessage
        },
        username: {
          ...this.state.username,
          message: usernameMessage
        },
        isLoading: false
      });
    }

  };

  render() {

    const { user } = this.props;

    const {
      email,
      username,
      avatar,
      isLoading
    } = this.state;

    const hasBeenEdited = email.value !== user.email
      || username.value !== user.username
      || avatar.value !== user.avatar;

    const errorMessages = (msg) => {
      if (msg.length) {
        return (
          <div className="submit-messages">
            <p>{ msg }</p>
          </div>
        );
      }
      return null;
    };

    const avatarPreview = (currentUser) => {
      if (currentUser.avatar) {
        return (
          <img
            className="circle avatar-img"
            alt="user-avatar"
            src={ this.state.avatar.value }
          />
        );
      }
      return (
        <div className="avatar-placeholder">
          <span>No Image</span>
        </div>
      );
    };

    return (
      <div className="card">
        <form
          noValidate
          onSubmit={ this.onSubmitHandler }
          className="for-profile">
          <div className="settings-header">
            <h4>Profile Settings</h4>
            <p>Update your email, username, and profile picture.</p>
          </div>
          { errorMessages(email.message) }
          <div className="settings-fields">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={ email.value }
              onChange={ this.onChangeHandler }
              disabled={ isLoading } />
            <p>This email is linked to your account.</p>
          </div>
          <div className="divider" />
          { errorMessages(username.message) }
          <div className="settings-fields">
            <label htmlFor="username">Display Name</label>
            <input
              type="text"
              id="username"
              name="username"
              value={ username.value }
              onChange={ this.onChangeHandler }
              disabled={ isLoading } />
            <p>This is the display name for your account.</p>
          </div>
          <div className="divider" />
          { errorMessages(avatar.message) }
          <div className="settings-fields last-field">
            <label>Profile Picture</label>
            <div className="uploader">
              {
                avatar.isLoading
                  ? <LoadingCircle color="teal" />
                  : avatarPreview(this.props.user)
              }
              <input
                type="file"
                accept="image/*"
                id="profilePicture"
                onChange={ this.onImageUpload } />
              <label htmlFor="profilePicture">
                <span>Upload</span>
                <span>Max 5mb, JPG, or PNG</span>
              </label>
            </div>
          </div>
          <div className="divider" />
          <button
            type="submit"
            disabled={ isLoading || !hasBeenEdited }>
            {
              isLoading
                ? <LoadingCircle color="#fff" />
                : 'Save Changes'
            }
          </button>
        </form>
      </div>
    );
  }
}

export default ProfileSettings;
