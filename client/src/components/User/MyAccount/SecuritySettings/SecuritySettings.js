import React, { Component } from 'react';
import axios from 'axios';
import PlainBtn from 'sharedComponents/PlainBtn';
import LoadingCircle from 'sharedComponents/LoadingCircle';

import inputValidator from 'sharedUtils/inputValidator';

import './SecuritySettings.scss';

class SecuritySettings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      isLoading: false,
      hasBeenVerified: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      message: []
    };
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmitHandler = (e) => {
    e.preventDefault();
    if (!this.state.hasBeenVerified) {
      this.setState({
        isEditing: true
      });
    }
  };

  verifyCurrentPassword = async () => {

    this.setState({ isLoading: true });

    try {

      const { status } = await axios.post('/api/user/validate/password', {
        password: this.state.currentPassword
      });

      if (status === 204) {
        this.setState({
          isLoading: false,
          isEditing: false,
          hasBeenVerified: true,
          message: []
        });
      }

    } catch (error) {

      this.setState({
        message: [error.response.data.message]
      });

    }

    this.setState({ isLoading: false });

  };

  submitNewPassword = async () => {

    this.setState({ isLoading: true });

    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = this.state;

    const messages = [];

    this.setState({ message: [] });

    if (inputValidator.isEmpty(newPassword)) {
      messages.push('Please enter new password.');
    } else if (newPassword.length < 6) {
      messages.push('Password must be more than 6 characters.');
    } else if (newPassword.length > 20) {
      messages.push('Password must be less than 20 characters.');
    }

    if (inputValidator.isEmpty(confirmPassword)) {
      messages.push('Please confirm new password.');
    } else if (newPassword !== confirmPassword) {
      messages.push('Password does not match the confirm password.');
    }

    if (newPassword === currentPassword) {
      messages.push('New password must be different from current password.');
    }

    if (messages.length > 0) {
      return this.setState({
        isLoading: false,
        message: messages
      });
    }

    try {

      const { status } = await axios.put('/api/user/update/password', { newPassword });

      if (status === 204) {
        this.setState({
          isEditing: false,
          isLoading: false,
          hasBeenVerified: false,
        });
        this.props.onPasswordChange();
      }

    } catch (error) {

      console.error(error.response.data.error);
      this.setState({
        isLoading: false,
        message: [error.response.data.message]
      });

    }

  };

  render() {
    return (
      <div className="card">
        <form
          noValidate
          onSubmit={ this.onSubmitHandler }
          className="for-security">
          <div className="settings-header">
            <h4>Security Settings</h4>
            <p>Change your password, or delete your account</p>
          </div>
          {
            this.state.message.map((msg) => {
              return (
                <div
                  key={ msg.length }
                  className="submit-messages">
                  <p>{ msg }</p>
                </div>
              );
            })
          }
          {
            this.state.isEditing
              ? (
                <div className="settings-fields">
                  <label htmlFor="password">Confirm your password</label>
                  <input
                    type="password"
                    id="password"
                    name="currentPassword"
                    onChange={ this.onChangeHandler }
                    disabled={ this.state.isLoading }
                  />
                  <p>Please enter your current password to proceed.</p>
                  <PlainBtn
                    onClick={ this.verifyCurrentPassword }>
                    {
                      this.state.isLoading
                        ? <LoadingCircle color="#fff" />
                        : 'Submit'
                    }
                  </PlainBtn>
                </div>
              )
              : null
          }
          {
            this.state.hasBeenVerified
              ? (
                <div className="settings-fields">
                  <label htmlFor="newPassword">Enter new password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    onChange={ this.onChangeHandler }
                    disabled={ this.state.isLoading }
                  />
                  <p>Please enter new password.</p>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    onChange={ this.onChangeHandler }
                    disabled={ this.state.isLoading }
                  />
                  <p>Please confirm the new password.</p>
                  <PlainBtn
                    disabled={ this.state.isLoading }
                    onClick={ this.submitNewPassword }>
                    {
                      this.state.isLoading
                        ? <LoadingCircle color="#fff" />
                        : 'Submit'
                    }
                  </PlainBtn>
                </div>
              )
              : null
          }
          <div className="button-group">
            <button type="submit">
              Change Password
            </button>
            <button type="submit">
              Delete Account
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default SecuritySettings;
