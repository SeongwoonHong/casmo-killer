import { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import * as storage from '@sharedUtils/storage';

class AuthLoader extends Component {

  componentDidMount() {
    this.verifyLoginStatus();
  }

  componentWillReceiveProps(nextProps) {

    const { user } = nextProps;

    if (this.props.user.isLoggedIn !== user.isLoggedIn) {

      if (!user.isLoggedIn) {

        toast.info('Successfully logged out', {
          position: toast.POSITION_TOP_RIGHT
        });

      } else if (user.isLoggedIn) {

        toast.info(`Welcome ${user.displayName}!`, {
          position: toast.POSITION_TOP_RIGHT
        });

      }

    }

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
