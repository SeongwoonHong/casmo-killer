import { connect } from 'react-redux';
import * as actions from '@actions';
import Article from './Article';

const mapStateToProps = (state, ownProps) => {
  return {
    updateComment: state.posts.updateComment,
    user: state.user,
    postId: ownProps.match.params.id,
    activePost: state.posts.activePost,
    // postId: ownProps.match.params.postId,
    deletePost: state.posts.deletePost,
    editPost: state.posts.editPost,
    // newComment: state.posts.newComment,
    // likes: state.posts.likes,
    // disLikes: state.posts.disLikes,
    // user: state.user,
    form: state.form.PostForm,
    replyComment: state.posts.replyComment
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchPostRequest: (id) => {
      dispatch(actions.fetchPostRequest(id));
    },
    createCommentRequest: (comment, postId, replyComment) => {
      dispatch(actions.createCommentRequest(comment, postId, replyComment));
    },
    giveLikesRequest: (postId, type, commentId) => {
      return dispatch(actions.giveLikesRequest(postId, type, commentId));
    },
    giveDisLikesRequest: (postId, type, commentId) => {
      return dispatch(actions.giveDislikesRequest(postId, type, commentId));
    },
    deleteCommentRequest: (postId, commentId, index) => {
      return dispatch(actions.deleteCommentRequest(postId, commentId, index));
    },
    updateCommentRequest: (postId, commentId, contents) => {
      return dispatch(actions.updateCommentRequest(postId, commentId, contents));
    },
    replyCommentRequest: (data) => {
      return dispatch(actions.replyCommentRequest(data));
    },
    replyCommentReset: () => {
      return dispatch(actions.replyCommentReset());
    },
    deletePostRequest: () => {
      return dispatch(actions.deletePostRequest(ownProps.match.params.id));
    },
    openUserInfoModal: (userInfo, mode = 'user') => {
      dispatch(actions.openUserInfoModal(userInfo, mode));
    },
    tagsSearchRequest: (tag) => {
      return dispatch(actions.tagsSearchRequest(tag));
    },
    editPostRequest: (postId, values) => {
      return dispatch(actions.editPostRequest(postId, values));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Article);
