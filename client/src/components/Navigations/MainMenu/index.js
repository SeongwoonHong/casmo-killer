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
    toggleMenu: (payload = null) => dispatch(actions.toggleMenu(payload))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);
