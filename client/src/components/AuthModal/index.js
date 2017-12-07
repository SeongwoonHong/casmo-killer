import { connect } from 'react-redux';
import * as actions from 'actions';

import AuthModal from './AuthModal';

function mapStateToProps(state) {
  return {
    auth: state.auth,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeAuthModal: () => dispatch(actions.closeAuthModal()),
    startAuthProcess: () => dispatch(actions.startAuthProcess()),
    setUserForRegister: payload => dispatch(actions.setUserForRegister(payload)),
    loginSuccess: payload => dispatch(actions.loginSuccess(payload))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthModal);
