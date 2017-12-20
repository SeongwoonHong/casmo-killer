import React, { Component } from 'react';
import * as storageUtils from 'sharedUtils/storageUtils';

import './MyAccount.scss';
import ProfileSettings from './ProfileSettings/ProfileSettings';
import SecuritySettings from './SecuritySettings/SecuritySettings';

class MyAccount extends Component {

  onProfileChange = async (payload) => {
    const user = await storageUtils.set('ckUser', payload);
    this.props.loginSuccess(user);
    Materialize.toast('Profile has successfully been updated.', 2000);
  };

  onPasswordChange = () => {
    Materialize.toast('Password has successfully been updated.', 2000);
  };

  render() {
    return (
      <div className="account-settings">
        <ProfileSettings
          user={ this.props.user }
          onSuccess={ this.onProfileChange }
        />
        <SecuritySettings
          onPasswordChange={ this.onPasswordChange }
        />
      </div>
    );
  }
}

export default MyAccount;
