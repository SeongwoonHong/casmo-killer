import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import LoadingOverlay from 'sharedComponents/LoadingOverlay';
import FormMessage from 'sharedComponents/FormMessage';

import './Delete.scss';

class Delete extends Component {

  constructor(props) {

    super(props);

    this.state = {
      isLoading: false,
      agreed: false,
      password: '',
      isSuccess: false,
      message: ''
    };

  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmitHandler = async (e) => {

    e.preventDefault();

    if (!this.state.agreed) {
      return this.setState({ agreed: true });
    }

    this.setState({ isLoading: true });

    if (this.state.password.length === 0) {
      return this.setState({
        isLoading: false,
        isSuccess: false,
        message: 'Please enter your password to continue.'
      });
    }

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

  };

  render() {

    const {
      isLoading, agreed, password, isSuccess, message
    } = this.state;

    return (
      <div className="Delete">
        <h2 className="user-page-title">
          Account Delete
          <i className="material-icons">
            delete_forever
          </i>
        </h2>
        <div className="user-form-box">
          <LoadingOverlay
            isVisible={ isLoading }
            overlayColor="rgba(256,256,256,.75)"
            circleColor="#1F4B40" />
          <div className="user-form-header">
            {
              !agreed
                ? <h3>Confirm Account Deletion</h3>
                : <h3>Please Confirm Your Password</h3>
            }
            {
              !agreed
                ? <p>This will permanently delete your account. This process is irreversible.</p>
                : null
            }
          </div>
          <form
            noValidate
            className="user-form"
            onSubmit={ this.onSubmitHandler }>
            <FormMessage
              message={ message }
              type={ isSuccess ? 'success' : 'error' } />
            {
              agreed
                ? (
                  <div className="user-form-fields">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      onChange={ this.onChangeHandler }
                      value={ password } />
                  </div>
                )
                : null
            }
            {
              isSuccess && message.length > 0
                ? (
                  <Link
                    to="/"
                    className="user-form-button">
                    Ck-Board Home
                  </Link>
                )
                : (
                  <button
                    type="submit"
                    className="user-form-button">
                    { agreed ? 'Delete My Account' : 'Agree' }
                  </button>
                )
            }
          </form>
        </div>
      </div>
    );

  }

}

export default Delete;
