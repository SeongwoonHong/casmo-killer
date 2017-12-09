import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import ConnectTransitionWrapper from '../ConnectTransitionWrapper/ConnectTransitionWrapper';
import Reply from './Reply';
import * as actions from '../../actions/post';

const mapStateToProps = (state) => {
  return {
    state
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
    }
  };
};

export default ConnectTransitionWrapper()(
  reduxForm({ form: 'PostForm' })(
    connect(mapStateToProps, mapDispatchToProps, undefined, { withRef: true }
    )(Reply)));
