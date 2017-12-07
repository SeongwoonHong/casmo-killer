import { connect } from 'react-redux';
import * as actions from 'actions';

import Register from './Register';

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

function mapDispatchToProps(dispatch) {
  return {
    startAuthProcess: () => dispatch(actions.startAuthProcess())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
