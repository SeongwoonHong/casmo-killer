import React, { Component } from 'react';
import axios from 'axios/index';

import * as storage from '@sharedUtils/storage';
import LoadingOverlay from '@sharedComponents/LoadingOverlay';
import FormMessage from '@sharedComponents/FormMessage';

import ProfileSettings from '../../components/ProfileSettings';
import SecuritySettings from '../../components/SecuritySettings';

import './UserSettings.scss';

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

        if (data && data.user && data.message) {

          this.setState({
            isSuccess: true,
            message: data.message
          });

          const user = await storage.set('ckUser', data.user);
          this.props.loginSuccess(user);

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
            person
          </i>
        </h2>
        <FormMessage
          message={ message }
          type={ isSuccess ? 'success' : 'error' } />
        <ProfileSettings
          user={ user }
          onSuccess={ this.onProfileChange } />
        <SecuritySettings
          strategy={ user.strategy } />
      </div>
    );

  }

}

export default MyAccount;
