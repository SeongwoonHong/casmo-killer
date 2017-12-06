import { connect } from 'react-redux';
import * as actions from 'actions';

import SocialAuth from './SocialAuth';

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

function mapDispatchToProps(dispatch) {
  return {
    redirectToRegister: () => dispatch(actions.redirectToRegister()),
    startAuthProcess: () => dispatch(actions.startAuthProcess()),
    stopAuthProcess: () => dispatch(actions.stopAuthProcess())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialAuth);
