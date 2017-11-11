import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from './Login';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}
function mapDispatchToProps(dispatch) {
  return {
    loginRequest: email => dispatch(actions.loginRequest(email))
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
