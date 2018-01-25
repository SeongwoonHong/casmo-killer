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
        isSuccess: false,
        message: 'Please enter your email address'
      });
    } else {

      try {

        const { data } = await axios.post('/api/auth/request/passwordReset', {
          email: this.state.email
        });

        if (data && data.message) {
          this.setState({
            isSuccess: true,
            message: data.message
          });
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

    const {
      isLoading, email, isSuccess, message
    } = this.state;

    return (
      <UserPageContainer
        className="Recover"
        title="Reset Your Password"
        icon="refresh"
        isLoading={ isLoading }
        formTitle="Please enter your email"
        formMsg="Enter your email address below, and we will send you a link where you can reset your password."
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
          name="email"
          onChange={ this.onChangeHandler }
          value={ email }
          message="The instruction email will be sent to this email." />
      </UserPageContainer>
    );

  }

}

export default Recover;
