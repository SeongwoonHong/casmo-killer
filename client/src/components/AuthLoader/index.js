import { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import * as actions from 'actions';
import * as storage from 'sharedUtils/storage';

class AuthLoader extends Component {

  componentDidMount() {
    this.verifyLoginStatus();
  }

  verifyLoginStatus = async () => {

    const user = await storage.get('ckUser');

    if (user) {
      this.props.loginSuccess(user);
    }

    try {

      const { data } = await axios.get('/api/user/verify/status');

      if (data.user) {
        const newUser = await storage.set('ckUser', data.user);
        this.props.loginSuccess(newUser);
      }

    } catch (error) {
      storage.remove('ckUser');
    }

  };

  render() {
    return null;

  }

}

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loginSuccess: payload => dispatch(actions.loginSuccess(payload))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoader);
