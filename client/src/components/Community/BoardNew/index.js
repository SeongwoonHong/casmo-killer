import { connect } from 'react-redux';
import * as actions from 'actions';
import BoardNew from './BoardNew';

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
