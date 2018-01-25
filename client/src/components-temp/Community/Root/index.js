import { connect } from 'react-redux';
import * as actions from 'actions';
import Community from './Community';

const mapStateToProps = (state) => {
  return {
    boardList: state.boards.boardList,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchBoardsRequest: (user, type) => {
      dispatch(actions.fetchBoardsRequest(user, type));
    },
    resetBoardList: () => {
      dispatch(actions.resetBoardList());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Community);
