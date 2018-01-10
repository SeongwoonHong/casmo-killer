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
        errorMsg: 'Please submit your email again to complete to reset the password.'
      });

      history.push('/error');

    }

  }

  onChangeHandler = (e) => {
    this.setState({ [e.name]: e.value });
  };

  onSubmitHandler = async () => {

    this.setState({
      isLoading: true,
      message: ''
    });

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
        // TODO: probably should redirect to login page
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

  verifyToken = async (token) => {

    const {
      history, setErrorState
    } = this.props;

    try {

      const { data } = await axios.get(`/api/auth/verify/token/reset/${token}`);

      if (data && data.email) {
        this.setState({
          isLoading: false,
          email: data.email
        });
      }

      this.props.history.replace('/user/reset');

    } catch (error) {

      console.error(error);

      // TODO: better title and message from the server
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
        title="Reset your password"
        icon="lock_open"
        formTitle="Please enter new password."
        isLoading={ isLoading }
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
          message="Enter new password"
          onChange={ this.onChangeHandler }
          value={ newPassword }
          disabled={ email.length === 0 } />
        <UserInputField
          isVisible={ !isSuccess }
          type="password"
          name="confirmPassword"
          message="Confirm your password"
          onChange={ this.onChangeHandler }
          value={ confirmPassword }
          disabled={ email.length === 0 } />
      </UserPageContainer>
    );

  }

}

export default Reset;
