import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import Materialize from 'materialize-css';
import PostNew from './PostNew';
import { createPost, createPostFailure, createPostSuccess, resetNewPost } from '../../../actions/post';

function mapStateToProps(state) {
  return {
    newPost: state.posts.newPost
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetMe: () => {
      dispatch(resetNewPost());
    },
    // For any field errors upon submission (i.e. not instant check)
    validateAndCreatePost: (values) => {
      return dispatch(createPost(values, sessionStorage.getItem('jwtToken')))
        .then((result) => {
          // Note: Error's "data" is in result.payload.response.data (inside "response")
          // success's "data" is in result.payload.data
          if (result.payload.response && result.payload.response.status !== 200) {
            dispatch(createPostFailure(result.payload.response.data));
            Materialize.toast($(`<span style="color: #FF0000">${result.payload.response.data.message}</span>`), 3000);
            throw new SubmissionError(result.payload.response.data);
          }
          // let other components know that everything is fine by updating the redux` state
          dispatch(createPostSuccess(result.payload.data));
          // ps: this is same as dispatching RESET_USER_FIELDS
        });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostNew);
