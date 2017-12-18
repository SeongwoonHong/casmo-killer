import { connect } from 'react-redux';

import Register from './Register';

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps, null)(Register);
