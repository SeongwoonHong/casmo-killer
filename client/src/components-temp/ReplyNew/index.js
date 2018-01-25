import { connect } from 'react-redux';
import ReplyNew from './ReplyNew';
import * as actions from '../../actions/post';

const mapStateToProps = (state) => {
  return {
    replyComment: state.posts.replyComment
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    replyCommentReset: () => {
      return dispatch(actions.replyCommentReset());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReplyNew);
