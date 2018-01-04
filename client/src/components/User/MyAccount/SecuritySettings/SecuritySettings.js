import React, { Component } from 'react';
import axios from 'axios';

import LoadingOverlay from 'sharedComponents/LoadingOverlay';
import FormMessage from 'sharedComponents/FormMessage';

import { trim, validatePassword } from 'sharedUtils/inputValidators';

import './SecuritySettings.scss';

class SecuritySettings extends Component {

  constructor(props) {

    super(props);

    this.state = {
      isLoading: false,
      isEditing: false,
      isVerified: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      message: '',
      isSuccess: false
    };

  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.name]: trim(e.target.value) });
  };

  onSubmitHandler = (e) => {
    e.preventDefault();
  };

  verifyCurrentPassword = async () => {

    const { currentPassword } = this.state;

    this.setState({ isLoading: true });

    const passwordMsg = await validatePassword(currentPassword);

    if (passwordMsg.length > 0) {

      this.setState({ message: passwordMsg });

    } else {

      try {

        const { status } = await axios.post('/api/user/verify/password', {
          password: currentPassword
        });

        if (status === 204) {
          this.setState({
            isEditing: false,
            isVerified: true,
            currentPassword: '',
            message: ''
          });
        }

      } catch (error) {

        console.error(error);
        this.setState({
          message: error.response.data.message
        });

      }

    }

    this.setState({ isLoading: false });

  };

  submitNewPassword = async () => {

    this.setState({ isLoading: true });

    const { newPassword, confirmPassword } = this.state;

    this.setState({ message: '' });

    const validationMsg = await validatePassword(newPassword, confirmPassword);

    if (validationMsg.length > 0) {
      return this.setState({
        isLoading: false,
        message: validationMsg
      });
    }

    try {

      const { status } = await axios.put('/api/user/update/password', { newPassword });

      if (status === 204) {
        this.setState({
          isEditing: false,
          isLoading: false,
          isVerified: false,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          message: 'Your password has been successfully updated.',
          isSuccess: true
        });
      }

    } catch (error) {

      console.error(error.response.data.error);
      this.setState({
        isLoading: false,
        message: error.response.data.message
      });

    }

  };

  render() {

    const {
      currentPassword, newPassword, confirmPassword, message, isLoading, isSuccess
    } = this.state;

    return (
      <form
        noValidate
        onSubmit={ this.onSubmitHandler }
        className="user-form-box for-security">
        <LoadingOverlay
          isVisible={ isLoading }
          overlayColor="rgba(256,256,256,.75)"
          circleColor="#1F4B40" />
        <div className="user-form-header">
          <h3>Security Settings</h3>
          <p>Change your password, or delete your account</p>
          <FormMessage message={ message } type={ isSuccess ? 'success' : 'error' } />
        </div>
        {
          this.state.isEditing
            ? (
              <div className="user-form-fields">
                <label htmlFor="password">Confirm your password</label>
                <input
                  type="password"
                  id="password"
                  name="currentPassword"
                  value={ currentPassword }
                  onChange={ this.onChangeHandler } />
                <p>Please enter your current password to proceed.</p>
                <button
                  type="submit"
                  className="user-form-button"
                  onClick={ this.verifyCurrentPassword }>
                  Submit
                </button>
              </div>
            )
            : null
        }
        {
          this.state.isVerified
            ? (
              <div className="user-form-fields">
                <label htmlFor="newPassword">Enter new password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={ newPassword }
                  onChange={ this.onChangeHandler } />
                <p>Please enter new password.</p>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={ confirmPassword }
                  onChange={ this.onChangeHandler } />
                <p>Please confirm the new password.</p>
                <button
                  type="submit"
                  onClick={ this.submitNewPassword }>
                  Submit
                </button>
              </div>
            )
            : null
        }
        <div className="button-group">
          <button
            type="button"
            className="user-form-button"
            onClick={ () => {
              this.setState({ isEditing: true });
            }}>
            Change Password
          </button>
          <button
            type="button"
            className="user-form-button">
            Delete Account
          </button>
        </div>
      </form>
    );

  }

}

export default SecuritySettings;
