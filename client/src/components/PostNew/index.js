import { connect } from 'react-redux';
import PostNew from './PostNew';
import { resetNewPost } from '../../actions/post';

function mapStateToProps(state) {
  return {
    newPost: state.posts.newPost
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetMe: () => {
      dispatch(resetNewPost());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostNew);
