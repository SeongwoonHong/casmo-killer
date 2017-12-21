import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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
    loginSuccess: (payload) => {
      dispatch(actions.loginSuccess(payload));
      dispatch(actions.closeAuthModal());
    },
    setUserForRegister: payload => dispatch(actions.setUserForRegister(payload))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthModal));
