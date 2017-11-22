import { connect } from 'react-redux';
import PostDetail from './PostDetail';
import * as actions from '../../../actions/post';

function mapStateToProps(state, ownProps) {
  return {
    activePost: state.posts.activePost,
    postId: ownProps.match.params.postId,
    deletePost: state.posts.deletePost,
    editPost: state.posts.editPost,
    newComment: state.posts.newComment,
    likes: state.posts.likes
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchPostRequest: (id) => {
      dispatch(actions.fetchPostRequest(id));
    },
    editPostRequest: (postId, values) => {
      return dispatch(actions.editPostRequest(postId, values));
    },
    onDeleteClick: () => {
      // const token = sessionStorage.getItem('jwtToken');
      // if (!token || token === '') { // if there is no token, dont bother,
      //   const data = { data: { message: 'Please Sign In' } }; // axios like error
      //   dispatch(deletePostFailure(data)); // but let other comps know
      //   return;
      // }
      return dispatch(actions.deletePostRequest(ownProps.match.params.postId));
    },
    resetPostProps: () => {
      // clean up both activePost(currrently open) and deletedPost(open and being deleted) states
      dispatch(actions.resetPostProps());
    },
    createReplyRequest: (comment, postId) => {
      return dispatch(actions.createReplyRequest(comment, postId));
    },
    giveLikesRequest: (id) => {
      return dispatch(actions.giveLikesRequest(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostDetail);
