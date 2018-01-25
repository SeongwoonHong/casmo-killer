import { connect } from 'react-redux';
import ReplyList from './ReplyList';

const mapStateToProps = (state) => {
  return {
    activePost: state.posts.activePost.data
  };
};

export default connect(mapStateToProps)(ReplyList);
