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
    loginSuccess: userInfo => dispatch(actions.loginSuccess(userInfo))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
