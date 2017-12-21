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
    updatePassword: password => dispatch(console.log(password))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
