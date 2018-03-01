import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { validatePassword } from '@sharedUtils/inputValidators';

import FormMessage from '@sharedComponents/FormMessage';

import UserPageContainer from '../UserPageContainer';
import UserInputField from '../UserInputField';

import './SecuritySettings.scss';

const initialState = {
  isLoading: false,
  isEditing: false,
  isVerified: false,
  isSuccess: false,
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  message: ''
};

class SecuritySettings extends Component {

  constructor(props) {

    super(props);

    this.state = initialState;

  }

  onChangeHandler = (e) => {
    this.setState({ [e.name]: e.value });
  };

  onSubmitHandler = () => {

    this.setState({
      isLoading: true,
      message: ''
    });

    if (!this.state.isVerified) {
      this.verifyCurrentPassword();
    } else {
      this.submitNewPassword();
    }

  };

  verifyCurrentPassword = async () => {

    const { currentPassword } = this.state;

    if (currentPassword.length === 0) {

      this.setState({
        isSuccess: false,
        message: 'Please enter your password.'
      });

    } else {

      try {

        const { status } = await axios.post('/api/user/verify/password', {
          password: currentPassword
        });

        if (status === 204) {

          this.setState(Object.assign({}, initialState, {
            isVerified: true
          }));

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

  submitNewPassword = async () => {

    const { newPassword, confirmPassword } = this.state;

    const validationMsg = await validatePassword(newPassword, confirmPassword);

    if (validationMsg.length > 0) {

      this.setState({
        isSuccess: false,
        message: validationMsg
      });

    } else {

      try {

        const { status } = await axios.put('/api/user/update/password', { newPassword });

        if (status === 204) {
          this.setState({
            isSuccess: true,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            message: 'Your password has been successfully updated.'
          });
        } else {
          this.setState({
            isSuccess: false,
            message: 'Failed to communicate with the server.'
          });
        }

      } catch (error) {

        console.error(error.response.data.error);
        this.setState({
          isSuccess: false,
          message: error.response.data.message
        });

      }

    }

    this.setState({ isLoading: false });

  };

  render() {

    const {
      isLoading,
      isEditing,
      isVerified,
      isSuccess,
      currentPassword,
      newPassword,
      confirmPassword,
      message,
    } = this.state;

    const { strategy } = this.props;

    return (
      <UserPageContainer
        className="Security-settings"
        isLoading={ isLoading }
        formTitle="Security Settings"
        formMsg="Change your password, or delete your account"
        onSubmit={ this.onSubmitHandler }
        button={ (
          <div className="button-group">
            <button
              type="button"
              disabled={ strategy }
              className="user-form-button"
              onClick={ () => {
                if (isVerified) {
                  this.setState(initialState);
                } else if (!isEditing) {
                  this.setState({ isEditing: true });
                }
              }}>
              { isEditing || isVerified ? 'Cancel' : 'Change Password' }
            </button>
            <Link
              to="/user/delete"
              className="user-form-button">
              Delete Account
            </Link>
          </div>
        ) }>

        <FormMessage
          message={ message }
          type={ isSuccess ? 'success' : 'error' } />

        <UserInputField
          isVisible={ this.state.isEditing }
          type="password"
          name="currentPassword"
          title="Current Password"
          onChange={ this.onChangeHandler }
          value={ currentPassword }
          message="Please enter your current password to proceed.">
          <button
            type="submit"
            className="user-form-button">
            Submit
          </button>
        </UserInputField>

        <UserInputField
          isVisible={ this.state.isVerified }
          type="password"
          name="newPassword"
          title="New Password"
          onChange={ this.onChangeHandler }
          value={ newPassword }
          message="Enter new password" />
        <UserInputField
          isVisible={ this.state.isVerified }
          type="password"
          name="confirmPassword"
          title="Confirm Password"
          onChange={ this.onChangeHandler }
          value={ confirmPassword }
          message="Confirm your password">
          <button
            type="submit"
            className="user-form-button">
            Submit
          </button>
        </UserInputField>

      </UserPageContainer>
    );

  }

}

export default SecuritySettings;
