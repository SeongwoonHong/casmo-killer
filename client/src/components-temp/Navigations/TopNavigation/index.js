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
    toggleUserDropdown: payload => dispatch(actions.toggleUserDropdown(payload)),
    logout: () => dispatch(actions.logout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopNavigation);
