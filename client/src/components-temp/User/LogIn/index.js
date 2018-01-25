import { connect } from 'react-redux';
import * as actions from 'actions';

import Login from './Login';

function mapStateToProps(state) {
  return {
    auth: state.auth,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loginSuccess: (payload, shouldReset) => dispatch(actions.loginSuccess(payload, shouldReset)),
    clearRedirectUrl: () => dispatch(actions.clearRedirectUrl()),
    setUserForRegistration: userInfo => dispatch(actions.setUserForRegistration(userInfo))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
