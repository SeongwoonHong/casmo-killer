import { connect } from 'react-redux';
import UserMenu from './UserMenu';
import * as actions from '../../../actions';

const mapStateToProps = (state) => {
  return {
    layout: state.layout
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSearchForm: () => dispatch(actions.toggleSearchForm()),
    toggleMenu: () => dispatch(actions.toggleMenu())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
