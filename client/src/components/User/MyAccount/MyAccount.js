import React, { Component } from 'react';
import axios from 'axios/index';

import * as storage from 'sharedUtils/storage';
import LoadingOverlay from 'sharedComponents/LoadingOverlay';

import ProfileSettings from './ProfileSettings/ProfileSettings';
import SecuritySettings from './SecuritySettings/SecuritySettings';

import './MyAccount.scss';

class MyAccount extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  async componentDidMount() {
    const { token } = this.props.match.params;
    if (token) {
      this.verifyToken(token);
    }
  }

  onProfileChange = async (payload) => {
    const user = await storage.set('ckUser', payload);
    this.props.loginSuccess(user);
  };

  // TODO: verify the token and update the email address
  verifyToken = async (token) => {

    this.setState({ isLoading: true });

    try {

      const { data } = await axios.put('/api/user/update/email', { token });

      // TODO: need to setup a better UI to display operation result (success or failed)
      if (data) {
        console.log(data.user);
      }

    } catch (error) {
      console.error(error);
    }

  };

  render() {
    // TODO: need to disable email editing when the user is using social authentication
    return (
      <div className="account-settings">
        <LoadingOverlay
          isVisible={ this.state.isLoading }
          overlayColor="rgba(0,0,0,.75)"
          circleColor="#fff" />
        <ProfileSettings
          user={ this.props.user }
          onSuccess={ this.onProfileChange } />
        {
          this.props.user.strategy === 'local'
            ? <SecuritySettings />
            : null
        }
      </div>
    );
  }
}

export default MyAccount;
