import React, { Component } from 'react';
import axios from 'axios/index';

import * as storage from 'sharedUtils/storage';
import LoadingOverlay from 'sharedComponents/LoadingOverlay';
import FormMessage from 'sharedComponents/FormMessage';

import ProfileSettings from './ProfileSettings/ProfileSettings';
import SecuritySettings from './SecuritySettings/SecuritySettings';

import './MyAccount.scss';

class MyAccount extends Component {

  constructor(props) {

    super(props);

    this.state = {
      isLoading: false,
      isSuccess: false,
      message: ''
    };

  }

  componentDidMount() {

    const { token } = this.props.match.params;

    if (token) {
      this.verifyToken(token);
      this.props.history.replace('/user/settings');
    }

  }

  onProfileChange = async (userInfo) => {
    const user = await storage.set('ckUser', userInfo);
    this.props.loginSuccess(user);
  };

  verifyToken = async (token) => {

    this.setState({ isLoading: true });

    if (this.props.user.isLoggedIn) {
      try {
        const { data } = await axios.put('/api/user/update/email', { token });
        this.props.loginSuccess(data.user);
        this.setState({
          isLoading: false,
          isSuccess: true,
          message: 'Your email address has been successfully updated.'
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

    const { user } = this.props;
    const { isLoading, isSuccess, message } = this.state;

    return (
      <div className="My-account">
        <LoadingOverlay
          isVisible={ isLoading }
          overlayColor="rgba(0,0,0,.75)"
          circleColor="#fff" />
        <h2 className="user-page-title">
          My Account
          <i className="material-icons">
            perm_contact_calendar
          </i>
        </h2>
        <FormMessage
          message={ message }
          type={ isSuccess ? 'success' : 'error' } />
        <ProfileSettings
          user={ user }
          onSuccess={ this.onProfileChange } />
        {
          user.strategy === 'local'
            ? <SecuritySettings />
            : null
        }
      </div>
    );

  }

}

export default MyAccount;
