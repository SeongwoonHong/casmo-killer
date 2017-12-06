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
    redirectToRegister: () => dispatch(actions.redirectToRegister()),
    redirectToLogin: () => dispatch(actions.redirectToLogin()),
    setUserForRegister: payload => dispatch(actions.setUserForRegister(payload))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocalAuth);
