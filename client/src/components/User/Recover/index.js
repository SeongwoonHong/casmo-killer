import React, { Component } from 'react';
import axios from 'axios';

import LoadingOverlay from 'sharedComponents/LoadingOverlay';
import FormMessage from 'sharedComponents/FormMessage';

import './Recover.scss';

class Recover extends Component {

  constructor(props) {

    super(props);

    this.state = {
      isLoading: false,
      email: '',
      isSuccess: false,
      message: ''
    };

  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmitHandler = async (e) => {

    e.preventDefault();

    this.setState({ isLoading: true });

    if (this.state.email.length === 0) {
      return this.setState({
        isLoading: false,
        isSuccess: false,
        message: 'Please enter your email address'
      });
    }

    try {

      // TODO: need to differentiate from users registered with social authentications
      const { data } = await axios.post('/api/auth/request/passwordReset', {
        email: this.state.email
      });

      if (data && data.message) {
        this.setState({
          isLoading: false,
          isSuccess: true,
          message: data.message
        });
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

  render() {

    const {
      isLoading, email, isSuccess, message
    } = this.state;

    return (
      <div className="Recover">
        <h2 className="user-page-title">
          Forgot your password
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              onChange={ this.onChangeHandler }
              value={ email } />
            <p>Verification email will be sent to this email.</p>
          </div>
          <button
            type="submit"
            className="user-form-button"
            disabled={ isLoading }>
            Submit
          </button>
        </form>
      </div>
    );

  }

}

export default Recover;
