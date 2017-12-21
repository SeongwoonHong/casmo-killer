import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import ConnectTransitionWrapper from '../ConnectTransitionWrapper/ConnectTransitionWrapper';
import Reply from './Reply';
import * as actions from '../../actions/post';

const mapStateToProps = (state) => {
  return {
    updateComment: state.posts.updateComment,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
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
    replyComment: (data) => {
      return dispatch(actions.replyComment(data));
    }
  };
};

export default ConnectTransitionWrapper()(
  reduxForm({ })(
    connect(mapStateToProps, mapDispatchToProps, undefined, { withRef: true }
    )(Reply)));
