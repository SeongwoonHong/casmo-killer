import { connect } from 'react-redux';
import * as actions from '@actions';

import TopNavigation from './TopNavigation';

const mapStateToProps = (state) => {
  return {
    layout: state.layout
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleMenu: () => dispatch(actions.toggleMenu()),
    toggleUserMenu: payload => dispatch(actions.toggleUserMenu(payload))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopNavigation);
