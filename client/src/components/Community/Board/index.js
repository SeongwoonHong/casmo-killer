import { connect } from 'react-redux';
import { fetchPosts, fetchPostsSuccess, fetchPostsFailure, searchPosts, searchPostsSuccess, searchPostsFailure } from '../../../actions/post';
import Board from './Board';

const mapStateToProps = (state) => {
  return {
    postsList: state.posts.postsList,
    pagination: state.posts.pagination
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPosts: (boardId, page) => {
      if (page === null || page === undefined) {
        page = 1;
      } else {
        page += 1;
      }
      dispatch(fetchPosts(boardId, page)).then((response) => {
        !response.error ?
          dispatch(fetchPostsSuccess(response.payload.data)) :
          dispatch(fetchPostsFailure(response.payload.data));
      });
    },
    searchPosts: (searchWord, boardId, page) => {
      if (page === null || page === undefined) {
        page = 1;
      } else {
        page += 1;
      }
      if (searchWord === '') {
        dispatch(fetchPosts(boardId, page)).then((response) => {
          !response.error ?
            dispatch(fetchPostsSuccess(response.payload.data)) :
            dispatch(fetchPostsFailure(response.payload.data));
        });
      } else {
        dispatch(searchPosts(searchWord, boardId, page)).then((response) => {
          !response.error ?
            dispatch(searchPostsSuccess(response.payload.data)) :
            dispatch(searchPostsFailure(response.payload.data));
        });
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);
