import { connect } from 'react-redux';
import BoardNew from './BoardNew';
import * as actions from '../../../actions/board';

function mapStateToProps(state) {
  return {
    newBoard: state.boards.newBoard
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    createBoardRequest: (values) => {
      return dispatch(actions.createBoardRequest(values));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardNew);
