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
    toggleUserDropdown: isOpen => dispatch(actions.toggleUserDropdown(isOpen)),
    openAuthModal: authType => dispatch(actions.openAuthModal(authType))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
