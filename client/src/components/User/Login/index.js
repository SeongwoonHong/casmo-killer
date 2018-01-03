import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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
    loginSuccess: payload => dispatch(actions.loginSuccess(payload)),
    setUserForRegister: userInfo => dispatch(actions.setUserForRegister(userInfo))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
