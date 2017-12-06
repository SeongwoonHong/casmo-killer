import { connect } from 'react-redux';
import * as actions from '../../../actions/board';
import Community from './Community';

const mapStateToProps = (state) => {
  return {
    boardList: state.boards.boardList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchBoardsRequest: () => {
      dispatch(actions.fetchBoardsRequest());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Community);
