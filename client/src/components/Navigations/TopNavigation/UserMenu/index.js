import { connect } from 'react-redux';
import * as actions from 'actions';

import UserMenu from './UserMenu';

const mapStateToProps = (state) => {
  return {
    layout: state.layout,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleUserDropdown: isOpen => dispatch(actions.toggleUserDropdown(isOpen))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
