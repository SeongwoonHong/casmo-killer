import { connect } from 'react-redux';
import Login from './Login';
import * as actions from '../../actions/index';

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
function mapDispatchToProps(dispatch) {
  return {
    toggleLoginModal: () => dispatch(actions.toggleLoginModal()),
    loginSuccess: token => dispatch(actions.loginSuccess(token))
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
