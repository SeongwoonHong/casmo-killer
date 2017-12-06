import { connect } from 'react-redux';
import * as actions from '../../../actions/post';
import Board from './Board';

const mapStateToProps = (state) => {
  return {
    postsList: state.posts.list,
    pagination: state.posts.pagination
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPostsRequest: (boardId, page, sort) => {
      if (page === null || page === undefined) {
        page = 1;
      } else {
        page += 1;
      }
      dispatch(actions.fetchPostsRequest(boardId, page, sort));
    },
    searchPostsRequest: (searchWord, boardId, page, sort) => {
      if (page === null || page === undefined) {
        page = 1;
      } else {
        page += 1;
      }
      if (searchWord === '') {
        dispatch(actions.fetchPostsRequest(boardId, page, sort));
      } else {
        dispatch(actions.searchPostsRequest(searchWord, boardId, page, sort));
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);
