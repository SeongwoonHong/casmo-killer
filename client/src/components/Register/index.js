import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Register from './Register';
import * as actions from '../../actions';

function mapDispatchToProps(dispatch) {
  return {
    registerRequest: (username, email, password, confirmPassword) => {
      return dispatch(actions.registerRequest(username, email, password, confirmPassword));
    }
  };
}
export default connect(null, mapDispatchToProps)(withRouter(Register));
