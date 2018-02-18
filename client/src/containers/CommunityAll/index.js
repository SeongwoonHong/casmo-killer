import { connect } from 'react-redux';
import * as actions from '@actions';
import CommunityAll from './CommunityAll';

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
    searchBoardsRequest: (user, type, searchWord) => {
      dispatch(actions.fetchBoardsRequest(user, type, searchWord));
    },
    resetBoardList: () => {
      dispatch(actions.resetBoardList());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommunityAll);
