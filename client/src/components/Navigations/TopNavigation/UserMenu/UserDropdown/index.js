import { connect } from 'react-redux';
import UserMenuDropdown from './UserMenuDropdown';

import * as actions from '../../../../../actions';

const mapStateToProps = (state) => {
  return {
    layout: state.layout
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserMenuDropdown);
