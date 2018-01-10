import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import FormMessage from 'sharedComponents/FormMessage';

import UserPageContainer from '../shared/UserPageContainer';
import UserInputField from '../shared/UserInputField';

import './Delete.scss';

class Delete extends Component {

  constructor(props) {

    super(props);

    this.state = {
      isLoading: false,
      isSuccess: false,
      agreed: false,
      password: '',
      message: ''
    };

  }

  onChangeHandler = (e) => {
    this.setState({ [e.name]: e.value });
  };

  onSubmitHandler = async () => {

    if (!this.state.agreed) {
      return this.setState({ agreed: true });
    }

    this.setState({ isLoading: true });

    if (this.state.password.length === 0) {

      this.setState({
        isLoading: false,
        isSuccess: false,
        message: 'Please enter your password to continue.'
      });

    } else {

      try {
        const { status } = await axios.delete('/api/user/delete/account', {
          data: {
            password: this.state.password
          }
        });
        if (status === 204) {
          this.setState({
            isLoading: false,
            agreed: false,
            isSuccess: true,
            message: 'Your account has been fucking deleted for fucking ever.'
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

    }

  };

  render() {

    const {
      isLoading, agreed, password, isSuccess, message
    } = this.state;

    const button = (isComplete, agree) => {
      if (isComplete) {
        return (
          <Link
            to="/"
            className="user-form-button">
            Ck-Board Home
          </Link>
        );
      }
      return (
        <button
          type="submit"
          className="user-form-button">
          { agree ? 'Delete My Account' : 'Agree' }
        </button>
      );
    };

    return (
      <UserPageContainer
        className="Delete"
        title="Account Delete"
        icon="delete_forever"
        formTitle={
          agreed
            ? 'Please Confirm Your Password'
            : 'Confirm Account Deletion'
        }
        formMsg={
          agreed
            ? null
            : 'This will permanently delete your account. This process is irreversible.'
        }
        isLoading={ isLoading }
        onSubmit={ this.onSubmitHandler }
        button={ button(isSuccess && message.length > 0, agreed) }>
        <FormMessage
          message={ message }
          type={ isSuccess ? 'success' : 'error' } />
        <UserInputField
          isVisible={ agreed }
          type="password"
          name="password"
          onChange={ this.onChangeHandler }
          value={ password } />
      </UserPageContainer>
    );

  }

}

export default Delete;
