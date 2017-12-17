import { connect } from 'react-redux';
import * as actions from 'actions';
import PostNew from './PostNew';

function mapStateToProps(state) {
  return {
    newPost: state.posts.newPost
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    createPostRequest: (values, boardId) => {
      return dispatch(actions.createPostRequest(values, boardId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostNew);
