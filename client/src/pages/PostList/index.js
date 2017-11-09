import { connect } from 'react-redux';
import { fetchPosts, fetchPostsSuccess, fetchPostsFailure } from '../../actions/post';
import PostList from './PostList';

const mapStateToProps = (state) => {
  return {
    postsList: state.posts.postsList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPosts: () => {
      dispatch(fetchPosts()).then((response) => {
        !response.error ?
          dispatch(fetchPostsSuccess(response.payload.data)) :
          dispatch(fetchPostsFailure(response.payload.data));
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostList);
