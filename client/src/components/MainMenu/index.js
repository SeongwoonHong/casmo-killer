import { connect } from 'react-redux';
import MainMenu from './MainMenu';
import * as actions from '../../actions';

const mapStateToProps = (state) => {
  return {
    menu: state.menu
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleMenu: () => dispatch(actions.toggleMenu())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);
