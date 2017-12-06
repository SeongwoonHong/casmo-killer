import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Register from './Register';
// import * as actions from '../../actions/index';

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}
export default connect(null, mapDispatchToProps)(withRouter(Register));
