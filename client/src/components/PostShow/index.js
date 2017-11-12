import { connect } from 'react-redux';
import PostShow from './PostShow';
import { fetchPost, fetchPostFailure, fetchPostSuccess, resetActivePost,
  resetDeletedPost, resetEditPost,
  deletePost, deletePostFailure, deletePostSuccess,
  createReply, createReplyFailure, createReplySuccess } from '../../actions/post';

function mapStateToProps(globalState, ownProps) {
  return {
    activePost: globalState.posts.activePost,
    postId: ownProps.match.params.id,
    deletedPost: globalState.posts.deletedPost,
    editPost: globalState.posts.editPost
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchPost: (id) => {
      dispatch(fetchPost(id))
        .then((result) => {
          // Note: Error's "data" is in result.payload.response.data (inside "response")
          // success's "data" is in result.payload.data
          if (result.payload.response && result.payload.response.status !== 200) {
            dispatch(fetchPostFailure(result.payload.response.data));
          } else {
            dispatch(fetchPostSuccess(result.payload.data));
          }
        });
    },
    resetMe: () => {
      // clean up both activePost(currrently open) and deletedPost(open and being deleted) states
      dispatch(resetActivePost());
      dispatch(resetDeletedPost());
      dispatch(resetEditPost());
    },
    onDeleteClick: () => {
      // const token = sessionStorage.getItem('jwtToken');
      // if (!token || token === '') { // if there is no token, dont bother,
      //   const data = { data: { message: 'Please Sign In' } }; // axios like error
      //   dispatch(deletePostFailure(data)); // but let other comps know
      //   return;
      // }

      dispatch(deletePost(ownProps.match.params.id))
        .then((response) => {
          !response.error ?
            dispatch(deletePostSuccess(response.payload)) :
            dispatch(deletePostFailure(response.payload));
        });
    },
    handleReply: (comment, postId) => {
      dispatch(createReply(comment, postId))
        .then((response) => {
          !response.error ?
            dispatch(createReplySuccess(response.payload)) :
            dispatch(createReplyFailure(response.payload));
        });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostShow);
