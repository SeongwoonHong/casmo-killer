import { connect } from 'react-redux';
import * as actions from '../../../../actions/index';
import UserMenu from './UserMenu';

const mapStateToProps = (state) => {
  return {
    layout: state.layout,
    auth: state.auth
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleUserMenu: () => dispatch(actions.toggleUserMenu())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
