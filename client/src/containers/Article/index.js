import { connect } from 'react-redux';
import Article from './Article';

const mapStateToProps = (state) => {
  return {
    updateComment: state.posts.updateComment,
    user: state.user,
    // activePost: state.posts.activePost,
    // postId: ownProps.match.params.postId,
    // deletePost: state.posts.deletePost,
    // editPost: state.posts.editPost,
    // newComment: state.posts.newComment,
    // likes: state.posts.likes,
    // disLikes: state.posts.disLikes,
    // user: state.user,
    // replyComment: state.replyComment
  };
};
export default connect(mapStateToProps)(Article);
