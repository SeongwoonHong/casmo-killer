import { connect } from 'react-redux';
import * as actions from 'actions';

import TopNavigation from './TopNavigation';

const mapStateToProps = (state) => {
  return {
    user: state.user,
    layout: state.layout
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleMenu: () => dispatch(actions.toggleMenu()),
    toggleSearchForm: () => dispatch(actions.toggleSearchForm()),
    openAuthModal: authType => dispatch(actions.openAuthModal(authType)),
    toggleUserDropdown: isOpen => dispatch(actions.toggleUserDropdown(isOpen))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopNavigation);
