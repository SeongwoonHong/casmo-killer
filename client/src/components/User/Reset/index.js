import React, { Component } from 'react';
import axios from 'axios';

import { validatePassword } from 'sharedUtils/inputValidators';
import LoadingOverlay from 'sharedComponents/LoadingOverlay';
import FormMessage from 'sharedComponents/FormMessage';

import './Reset.scss';

class Reset extends Component {

  constructor(props) {

    super(props);

    this.state = {
      isLoading: true,
      email: '',
      newPassword: '',
      confirmPassword: '',
      isSuccess: false,
      message: ''
    };

  }

  componentDidMount() {

    const { token } = this.props.match.params;

    if (token) {
      this.verifyToken(token);
    } else {
      // TODO: can't land here without token
    }

  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmitHandler = async (e) => {

    e.preventDefault();

    this.setState({ isLoading: true });

    const { newPassword, confirmPassword } = this.state;

    const message = await validatePassword(newPassword, confirmPassword, true);

    if (message.length > 0) {
      return this.setState({
        isLoading: false,
        isSuccess: false,
        message
      });
    }

    try {

      const { data } = await axios.put('/api/auth/reset/password', {
        email: this.state.email,
        newPassword: this.state.newPassword
      });

      if (data && data.message) {
        console.log(data.message);
      }

    } catch (error) {
      console.error(error);
      this.setState({
        isLoading: false,
        isSuccess: false,
        message: error.response.data.message
      });
    }

  };

  verifyToken = async (token) => {

    try {

      const { data } = await axios.get(`/api/auth/verify/token/${token}/reset`);

      if (data && data.email) {
        this.setState({
          isLoading: false,
          email: data.email
        });
      }

      this.props.history.replace('/user/reset');

    } catch (error) {
      console.error(error);
      this.setState({
        isLoading: false,
        isSuccess: false,
        message: error.response.data.message
      });
    }

  };

  render() {

    const {
      isLoading, email, newPassword, confirmPassword, isSuccess, message
    } = this.state;

    return (
      <div className="Reset">
        <h2 className="user-page-title">
          Reset your password
        </h2>
        <form
          noValidate
          onSubmit={ this.onSubmitHandler }
          className="user-form-box">
          <LoadingOverlay
            isVisible={ isLoading }
            overlayColor="rgba(256,256,256,.75)"
            circleColor="#1F4B40" />
          <div className="user-form-header">
            <h3>Please enter your email.</h3>
          </div>
          <FormMessage
            message={ message }
            type={ isSuccess ? 'success' : 'error' } />
          <div className="user-form-fields">
            <label htmlFor="newPassword">Enter new password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              disabled={ email.length === 0 }
              value={ newPassword }
              onChange={ this.onChangeHandler } />
            <p>Please enter new password.</p>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              disabled={ email.length === 0 }
              value={ confirmPassword }
              onChange={ this.onChangeHandler } />
            <p>Please confirm the new password.</p>
            <button
              type="submit"
              onClick={ this.submitNewPassword }>
              Submit
            </button>
          </div>
          <button
            type="submit"
            className="user-form-button"
            disabled={ email.length === 0 }>
            Submit
          </button>
        </form>
      </div>
    );

  }

}

export default Reset;
