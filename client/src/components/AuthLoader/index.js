import { connect } from 'react-redux';
import * as actions from '@actions';

import AuthLoader from './AuthLoader';

function mapStateToProps(state) {
  return {
    user: state.user.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loginSuccess: payload => dispatch(actions.loginSuccess(payload)),
    logout: isLoggedIn => dispatch(actions.logout(isLoggedIn)),
    completeLoading: payload => dispatch(actions.toggleAppLoading(payload))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoader);
