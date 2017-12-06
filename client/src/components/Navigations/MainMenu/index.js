import { connect } from 'react-redux';
import * as actions from 'actions';

import MainMenu from './MainMenu';

const mapStateToProps = (state) => {
  return {
    layout: state.layout
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleMenu: () => dispatch(actions.toggleMenu()),
    toggleSubMenu: () => dispatch(actions.toggleSubMenu()),
    toggleSearchForm: () => dispatch(actions.toggleSearchForm())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);
