import { connect } from 'react-redux';
import * as actions from 'actions';
import Board from './Board';

const mapStateToProps = (state) => {
  return {
    postsList: state.posts.list,
    pagination: state.posts.pagination,
    boardAuthor: state.posts.boardAuthor
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
    },
    openUserInfoModal: (userInfo) => {
      dispatch(actions.openUserInfoModal(userInfo));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);
