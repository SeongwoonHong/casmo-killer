import { connect } from 'react-redux';
import * as actions from 'actions';

import Reset from './Reset';

function mapStateToProps(state) {
  return {
    auth: state.auth,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setErrorState: error => dispatch(actions.setErrorState(error))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Reset);
