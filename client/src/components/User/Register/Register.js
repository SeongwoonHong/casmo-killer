import React, { Component } from 'react';

import LoadingCircle from 'sharedComponents/LoadingCircle';
import FormMessage from 'sharedComponents/FormMessage';

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
        message: '',
        isLoading: false
      },
      isLoading: ''
    };
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: {
        ...this.state[e.target.name],
        value: e.target.value
      }
    });
  };

  render() {

    const {
      displayName, password, avatar, isLoading
    } = this.state;

    const { auth } = this.props;

    const avatarPreview = (avatarImg) => {
      if (!avatarImg) {
        return (
          <img
            className="circle avatar-img"
            alt="user-avatar"
            src={ avatarImg.value }
          />
        );
      }
      return <span>No Image</span>;
    };

    return (
      <form
        noValidate
        onSubmit={ this.onSubmitHandler }
        className="for-registration">
        <div className="settings-header">
          <h4>User Registration</h4>
          <p>Please fill in the following fields to complete your registration.</p>
        </div>
        <div className="settings-fields">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={ this.props.auth.email }
            disabled="true" />
          <p>This email is linked to your account.</p>
        </div>
        <FormMessage message={ displayName.message } />
        <div className="settings-fields">
          <label htmlFor="displayName">Display Name</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={ displayName.value }
            onChange={ this.onChangeHandler }
            disabled={ isLoading }
          />
          <p>Display name must be between 4 and 20 characters with no space.</p>
        </div>
        <FormMessage message={ password.message } />
        {
          auth.strategy === 'local'
            ? (
              <div className="settings-fields">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={ password.value }
                  onChange={ this.onChangeHandler }
                  disabled={ isLoading } />
                <p>Password must be between 6 and 20 letters.</p>
              </div>
            )
            : null
        }
        <FormMessage message={ avatar.message } />
        <div className="settings-fields">
          <label>Profile Picture</label>
          <div className="avatar-preview">
            <div className="avatar-wrapper">
              {
                avatar.isLoading
                  ? <LoadingCircle color="teal" />
                  : avatarPreview(avatar)
              }
            </div>
            <input
              type="file"
              accept="image/*"
              id="profilePicture"
              onChange={ this.onImageUpload }
              disabled={ avatar.isLoading } />
            <label htmlFor="profilePicture">
              <span>Upload New Picture</span>
              <span>Max 5mb, JPG, or PNG</span>
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={ isLoading }>
          {
            isLoading
              ? <LoadingCircle color="#fff" />
              : 'Submit'
          }
        </button>
      </form>
    );
  }

}

export default Register;
/*
if (inputValidator.isEmpty(password)) {
  messages.push('Please enter your password.');
} else if (password.length < 6) {
  messages.push('Password must be more than 6 characters.');
} else if (password.length > 20) {
  messages.push('Password must be less than 20 characters.');
// holding off on password validation
// until we decide on password rules
} else if (!inputValidator.isPassword(password)) {
  messages.push('The provided password is not valid.');
}
*/

