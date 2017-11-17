import { connect } from 'react-redux';
import TopNavigation from './TopNavigation';
import * as actions from '../../../actions/index';

const mapStateToProps = (state) => {
  return {
    layout: state.layout
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleMenu: () => dispatch(actions.toggleMenu()),
    toggleUserMenu: () => dispatch(actions.toggleUserMenu()),
    toggleSearchForm: () => dispatch(actions.toggleSearchForm())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopNavigation);
