import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import FormMessage from '@sharedComponents/FormMessage';

import UserPageContainer from '../../components/UserPageContainer';
import UserInputField from '../../components/UserInputField';

import './UserDelete.scss';

class Delete extends Component {

  constructor(props) {

    super(props);

    this.state = {
      isLoading: false,
      isSuccess: false,
      agreed: false,
      payload: '',
      message: ''
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);

  }

  onChangeHandler(e) {
    this.setState({ payload: e.value });
  }

  async onSubmitHandler() {

    if (!this.state.agreed) {
      this.setState({ agreed: true });
      return;
    }

    this.setState({ isLoading: true });

    if (this.state.payload.length === 0) {

      this.setState({
        isSuccess: false,
        message: 'Please enter your information to continue.'
      });

    } else {

      try {

        const { data } = await axios.delete('/api/user/delete/account', {
          data: {
            payload: this.state.payload
          }
        });

        if (data && data.message) {

          this.setState({
            isSuccess: true,
            agreed: false,
            message: data.message
          });

          this.props.removeUser();

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
          message: error.response && error.response.data.message
        });

      }

    }

    this.setState({ isLoading: false });

  }

  render() {

    const {
      isLoading, isSuccess, agreed, payload, message
    } = this.state;

    const { user, logout } = this.props;

    const button = (isComplete, agree, onClick) => {
      if (isComplete) {
        return (
          <Link
            to="/"
            className="user-form-button"
            onClick={ onClick }>
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
        isLoading={ isLoading }
        formTitle={
          !agreed
            ? 'Confirm Account Deletion'
            : 'Please Confirm Your Information'
        }
        formMsg={
          !agreed
            ? 'This will permanently delete your account. This process is irreversible.'
            : null
        }
        onSubmit={ this.onSubmitHandler }
        button={ button(
          isSuccess && message.length > 0,
          agreed,
          logout)
        }>
        <FormMessage
          message={ message }
          type={ isSuccess ? 'success' : 'error' } />
        <UserInputField
          isVisible={ agreed }
          name={ user.strategy === 'local' ? 'password' : 'email' }
          onChange={ this.onChangeHandler }
          value={ payload } />
      </UserPageContainer>
    );

  }

}

export default Delete;
