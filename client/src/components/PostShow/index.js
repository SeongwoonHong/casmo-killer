import { connect } from 'react-redux';
import PostShow from './PostShow';

const mapStateToProps = (state) => {
  return {
    activePost: state.posts.activePost
  };
};

export default connect(mapStateToProps)(PostShow);
