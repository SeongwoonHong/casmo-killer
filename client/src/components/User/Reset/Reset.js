import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { validatePassword } from 'sharedUtils/inputValidators';

import FormMessage from 'sharedComponents/FormMessage';

import UserPageContainer from '../shared/UserPageContainer';
import UserInputField from '../shared/UserInputField';

import './Reset.scss';

class Reset extends Component {

  constructor(props) {

    super(props);

    this.state = {
      isSuccess: false,
      isLoading: true,
      email: '',
      newPassword: '',
      confirmPassword: '',
      message: ''
    };

  }

  componentDidMount() {

    const { history, match, setErrorState } = this.props;

    if (match.params.token) {

      this.verifyToken(match.params.token);

    } else {

      setErrorState({
        errorTitle: 'The registration link is invalid.',
        errorMsg: 'Please submit your email again to reset the password.'
      });

      history.push('/error');

    }

  }

  onChangeHandler = (e) => {
    this.setState({ [e.name]: e.value });
  };

  onSubmitHandler = async () => {

    const { newPassword, confirmPassword } = this.state;

    this.setState({
      isLoading: true,
      message: ''
    });

    const message = await validatePassword(newPassword, confirmPassword, true);

    if (message.length > 0) {
      return this.setState({
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
        this.setState({
          isSuccess: true,
          message: data.message
        });
      } else {
        // TODO: better error handling
      }

    } catch (error) {

      console.error(error);
      this.setState({
        isSuccess: false,
        message: error.response.data.message
      });
    }

    this.setState({ isLoading: false });

  };

  verifyToken = async (token) => {

    const { history, setErrorState } = this.props;

    try {

      const { data } = await axios.get(`/api/auth/verify/token/reset/${token}`);

      if (data && data.email) {

        this.setState({
          isLoading: false,
          email: data.email
        });

        this.props.history.replace('/user/reset');

      } else {
        // TODO: error handling?
      }

    } catch (error) {

      console.error(error);

      setErrorState({
        errorTitle: 'The registration link is invalid.',
        errorMsg: error.response.data.message
      });

      history.push('/error');

    }

  };

  render() {

    const {
      isLoading, email, newPassword, confirmPassword, isSuccess, message
    } = this.state;

    return (
      <UserPageContainer
        className="Reset"
        title="Reset Your Password"
        icon="refresh"
        isLoading={ isLoading }
        formTitle="Please enter new password."
        onSubmit={ this.onSubmitHandler }
        button={
          !isSuccess
            ? (
              <button
                type="submit"
                className="user-form-button">
                Submit
              </button>
            )
            : (
              <Link
                to="/user/auth/login"
                className="user-form-button">
                Go to Log In
              </Link>
            )
        }>
        <FormMessage
          message={ message }
          type={ isSuccess ? 'success' : 'error' } />
        <UserInputField
          isVisible={ !isSuccess }
          type="password"
          name="newPassword"
          title="New Password"
          onChange={ this.onChangeHandler }
          value={ newPassword }
          disabled={ email.length === 0 }
          message="Enter new password" />
        <UserInputField
          isVisible={ !isSuccess }
          type="password"
          name="confirmPassword"
          title="Confirm Password"
          onChange={ this.onChangeHandler }
          value={ confirmPassword }
          disabled={ email.length === 0 }
          message="Confirm the new password" />
      </UserPageContainer>
    );

  }

}

export default Reset;
