import { connect } from 'react-redux';
import * as actions from 'actions';

import Delete from './Delete';

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    removeUser: () => dispatch(actions.removeUser()),
    logout: () => dispatch(actions.logout())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Delete);
