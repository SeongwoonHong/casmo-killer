import { connect } from 'react-redux';
import * as actions from 'actions';

import LocalAuth from './LocalAuth';

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeModal: () => dispatch(actions.closeAuthModal()),
    redirectToRegister: () => dispatch(actions.redirectToRegister()),
    redirectToLogin: () => dispatch(actions.redirectToLogin())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocalAuth);
