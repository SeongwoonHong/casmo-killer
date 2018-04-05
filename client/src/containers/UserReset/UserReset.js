import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { validatePassword } from '@sharedUtils/inputValidators';

import FormMessage from '@sharedComponents/FormMessage';

import UserPageContainer from '../../components/UserPageContainer';
import UserInputField from '../../components/UserInputField';

import './UserReset.scss';

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

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.verifyToken = this.verifyToken.bind(this);

  }

  componentDidMount() {

    const { history, match, setErrorState } = this.props;

    if (match.params.token) {

      // TODO: components that needs token verification can take advantage of HOC that's responsible for token verification
      this.verifyToken(match.params.token);

    } else {

      setErrorState({
        errorTitle: 'The registration link is invalid.',
        errorMsg: 'Please submit your email again to reset the password.'
      });

      history.push('/error');

    }

  }

  onChangeHandler(e) {
    this.setState({ [e.name]: e.value });
  }

  async onSubmitHandler() {

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

    this.setState({ isLoading: false });

  }

  async verifyToken(token) {

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

        setErrorState({
          errorTitle: 'This link is invalid.',
          errorMsg: 'Failed to communicate with the server.'
        });

        history.push('/error');

      }

    } catch (error) {

      console.error(error);

      setErrorState({
        errorTitle: 'This link is invalid.',
        errorMsg: error.response && error.response.data.message
      });

      history.push('/error');

    }

  }

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
