import { Component } from 'react';
import axios from 'axios';

import * as storage from '@sharedUtils/storage';

class AuthLoader extends Component {

  componentDidMount() {
    this.verifyLoginStatus();
  }

  verifyLoginStatus = async () => {

    const { loginSuccess, logout, completeLoading } = this.props;

    const user = storage.get('ckUser');

    if (user) {
      loginSuccess(user);
    }

    try {

      const { data } = await axios.get('/api/user/verify/status');

      if (data && data.user) {
        loginSuccess(data.user);
      } else {
        logout(false);
      }

    } catch (error) {
      logout(false);
    }

    completeLoading(false);

  };

  render() {
    return null;
  }

}

export default AuthLoader;
