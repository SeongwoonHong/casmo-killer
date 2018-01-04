import { connect } from 'react-redux';
import * as actions from 'actions';

import MyAccount from './MyAccount';

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loginSuccess: payload => dispatch(actions.loginSuccess(payload))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);
