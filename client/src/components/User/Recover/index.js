import React, { Component } from 'react';
import axios from 'axios';

import FormMessage from 'sharedComponents/FormMessage';

import UserPageContainer from '../shared/UserPageContainer';
import UserInputField from '../shared/UserInputField';

import './Recover.scss';

class Recover extends Component {

  constructor(props) {

    super(props);

    this.state = {
      isLoading: false,
      isSuccess: false,
      email: '',
      message: ''
    };

  }

  onChangeHandler = (e) => {
    this.setState({ [e.name]: e.value });
  };

  onSubmitHandler = async () => {

    this.setState({
      isLoading: true,
      message: ''
    });

    if (this.state.email.length === 0) {
      this.setState({
        isLoading: false,
        isSuccess: false,
        message: 'Please enter your email address'
      });
    } else {

      try {

        const { data } = await axios.post('/api/auth/request/passwordReset', {
          email: this.state.email
        });

        this.setState({
          isLoading: false,
          isSuccess: data && data.message,
          message: (data && data.message) || 'Failed to communicate with the server.'
        });

      } catch (error) {

        console.error(error);
        this.setState({
          isLoading: false,
          isSuccess: false,
          message: error.response.data.message
        });

      }

    }

  };

  render() {

    const {
      isLoading, email, isSuccess, message
    } = this.state;

    return (
      <UserPageContainer
        className="Recover"
        title="Forgot your password"
        icon="lock"
        formTitle="Please enter your email"
        isLoading={ isLoading }
        onSubmit={ this.onSubmitHandler }
        button={
          <button
            type="submit"
            className="user-form-button">
            {
              message.length > 0 && isSuccess
                ? 'Resend'
                : 'Submit'
            }
          </button>
        }>
        <FormMessage
          message={ message }
          type={ isSuccess ? 'success' : 'error' } />
        <UserInputField
          type="email"
          name="email"
          onChange={ this.onChangeHandler }
          value={ email }
          message="Verification email will be sent to this email." />
      </UserPageContainer>
    );

  }

}

export default Recover;
