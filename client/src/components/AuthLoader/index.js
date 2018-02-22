import { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import * as actions from '@actions';
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

export default connect(
  state => ({
    user: state.user.user
  }),
  dispatch => ({
    loginSuccess: payload => dispatch(actions.loginSuccess(payload)),
    logout: isLoggedIn => dispatch(actions.logout(isLoggedIn)),
    completeLoading: payload => dispatch(actions.toggleAppLoading(payload))
  })
)(AuthLoader);
