import { connect } from 'react-redux';
import * as actions from '@actions';

import AppNavigation from './AppNavigation';

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    layout: state.layout
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeAllMenu: () => {
      dispatch(actions.toggleMenu(false));
      dispatch(actions.toggleUserMenu(false));
    },
    toggleMenu: (payload = null) => dispatch(actions.toggleMenu(payload)),
    toggleUserMenu: payload => dispatch(actions.toggleUserMenu(payload)),
    logout: () => dispatch(actions.logout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigation);
