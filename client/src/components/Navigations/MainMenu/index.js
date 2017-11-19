import { connect } from 'react-redux';
import MainMenu from './MainMenu';
import * as actions from '../../../actions/index';

const mapStateToProps = (state) => {
  return {
    layout: state.layout
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleMenu: () => dispatch(actions.toggleMenu()),
    toggleSearchForm: () => dispatch(actions.toggleSearchForm())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);
