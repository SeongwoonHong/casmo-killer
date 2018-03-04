import { connect } from 'react-redux';
import * as actions from '@actions';

import UserLogin from './UserLogin';

function mapStateToProps(state) {
  return {
    auth: state.auth,
    user: state.user.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loginSuccess: (payload, shouldReset) => dispatch(actions.loginSuccess(payload, shouldReset)),
    setUserForRegistration: userInfo => dispatch(actions.setUserForRegistration(userInfo))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserLogin);
