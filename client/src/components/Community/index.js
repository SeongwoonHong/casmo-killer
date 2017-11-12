import { connect } from 'react-redux';
import Community from './Community';
import * as actions from '../../actions';

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

export default connect(mapStateToProps, mapDispatchToProps)(Community);
