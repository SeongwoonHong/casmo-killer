import React, { Component } from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Link, withRouter } from 'react-router-dom';
import { createPost, createPostFailure, createPostSuccess } from '../../actions/post';
import renderField from '../../components/Post/renderField';
import renderTextArea from '../../components/Post/renderTextArea';
import validatePost from '../../components/Post/validatePost';

class PostNew extends Component {
  componentWillMount() {
  // Important! If your component is navigating based on
  // some global state(from say componentWillReceiveProps)
  // always reset that global state back to null when you REMOUNT
    this.props.resetMe();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newPost.post && !nextProps.newPost.error) {
      this.props.history.push('/community');
    }
  }

  // For any field errors upon submission (i.e. not instant check)
  validateAndCreatePost = (values, dispatch) => {
    return dispatch(createPost(values, sessionStorage.getItem('jwtToken')))
      .then((result) => {
        // Note: Error's "data" is in result.payload.response.data (inside "response")
        // success's "data" is in result.payload.data
        if (result.payload.response && result.payload.response.status !== 200) {
          dispatch(createPostFailure(result.payload.response.data));
          throw new SubmissionError(result.payload.response.data);
        }
        // let other components know that everything is fine by updating the redux` state
        dispatch(createPostSuccess(result.payload.data));
        // ps: this is same as dispatching RESET_USER_FIELDS
      });
  };

  renderError(newPost) {
    if (newPost && newPost.error && newPost.error.message) {
      return (
        <div className="alert alert-danger">
          { newPost ? newPost.error.message.title : '' }
        </div>
      );
    }
    return (<span />);
  }

  render() {
    const { handleSubmit, submitting, newPost } = this.props;
    return (
      <div className="container">
        <div className="card">
          <div className="card-content">
            { this.renderError(newPost) }
            <form onSubmit={handleSubmit(this.validateAndCreatePost)}>
              <Field
                name="title"
                type="text"
                component={renderField}
                label="Title*"
              />
              <Field
                name="categories"
                type="text"
                component={renderField}
                label="Categories*"
              />
              <Field
                name="contents"
                component={renderTextArea}
                label="Content*"
              />
              <div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  Submit
                </button>
                <Link
                  to="/community"
                  className="btn btn-error"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  validatePost,
  form: 'PostsNewForm'
})(
  withRouter(PostNew)
);
