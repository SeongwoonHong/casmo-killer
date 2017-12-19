import { connect } from 'react-redux';
import * as actions from 'actions';

import MyAccount from './MyAccount';

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleMenu: () => dispatch(actions.toggleMenu())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);
