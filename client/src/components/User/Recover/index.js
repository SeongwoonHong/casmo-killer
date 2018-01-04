import { connect } from 'react-redux';
import * as actions from 'actions';

import Recover from './Recover';

function mapStateToProps(state) {
  return {
    auth: state.auth,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loginSuccess: userInfo => dispatch(actions.loginSuccess(userInfo))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Recover);
