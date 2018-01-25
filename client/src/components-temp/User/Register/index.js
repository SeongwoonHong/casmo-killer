import { connect } from 'react-redux';
import * as actions from 'actions';

import Register from './Register';

function mapStateToProps(state) {
  return {
    auth: state.auth,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUserForRegistration: payload => dispatch(actions.setUserForRegistration(payload)),
    loginSuccess: (payload, shouldReset) => dispatch(actions.loginSuccess(payload, shouldReset)),
    clearRedirectUrl: () => dispatch(actions.clearRedirectUrl()),
    setErrorState: error => dispatch(actions.setErrorState(error))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
