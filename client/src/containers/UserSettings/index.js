import { connect } from 'react-redux';
import * as actions from '@actions';

import UserSettings from './UserSettings';

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    user: state.user.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loginSuccess: payload => dispatch(actions.loginSuccess(payload))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
