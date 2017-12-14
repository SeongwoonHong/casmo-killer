import { connect } from 'react-redux';
import * as actions from '../../../actions/post';
import Board from './Board';

const mapStateToProps = (state) => {
  return {
    postsList: state.posts.list,
    pagination: state.posts.pagination,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPostsRequest: (boardId, page) => {
      if (page === null || page === undefined) {
        page = 1;
      } else {
        page += 1;
      }
      dispatch(actions.fetchPostsRequest(boardId, page));
    },
    searchPostsRequest: (searchWord, boardId, page) => {
      if (page === null || page === undefined) {
        page = 1;
      } else {
        page += 1;
      }
      if (searchWord === '') {
        dispatch(actions.fetchPostsRequest(boardId, page));
      } else {
        dispatch(actions.searchPostsRequest(searchWord, boardId, page));
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);
