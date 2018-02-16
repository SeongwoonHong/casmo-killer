import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import ConnectTransitionWrapper from '../../ConnectTransitionWrapper/ConnectTransitionWrapper';
import Comment from './Comment';
import * as actions from '../../../actions/post';

const mapStateToProps = (state) => {
  return {
    // updateComment: state.posts.updateComment,
    // user: state.user 여기 나중에 리덕스랑 제대로 연결되면 커멘트 풀어야함.
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
    connect(null, mapDispatchToProps, undefined, { withRef: true }
    )(Comment)));
