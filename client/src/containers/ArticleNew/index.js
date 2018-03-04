import { connect } from 'react-redux';
import * as actions from '@actions';
import ArticleNew from './ArticleNew';

const mapStateToProps = (state) => {
  return {
    updateComment: state.posts.updateComment,
    user: state.user.user,
    newPost: state.posts.newPost,
    data: state.posts.activePost.data
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createPostRequest: (values, boardId) => {
      return dispatch(actions.createPostRequest(values, boardId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleNew);
