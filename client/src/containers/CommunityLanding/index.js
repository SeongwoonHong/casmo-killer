import { connect } from 'react-redux';
import * as actions from '@actions';
import CommunityLanding from './CommunityLanding';

const mapStateToProps = (state) => {
  return {
    boardList: state.boards.boardList,
    activePost: state.posts.activePost,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchBoardsRequestWithSort: (sortType = 'asc', limit = 1000) => {
      return dispatch(actions.fetchBoardsRequestWithSort(sortType, limit));
    },
    fetchMostLikedPosts: () => {
      return dispatch(actions.fetchMostLikedPosts());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommunityLanding);
