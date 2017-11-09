import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import renderField from '../../components/Post/renderField';
import renderTextArea from '../../components/Post/renderTextArea';
import validatePost from '../../components/Post/validatePost';

class PostShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false
    };
    this.toggleEdit = this.toggleEdit.bind(this);
  }

  componentDidMount() {
    this.props.fetchPost(this.props.postId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.deletedPost.error && nextProps.deletedPost.error.message) { // delete failure
      alert(nextProps.deletedPost.error.message || 'Could not delete. Please try again.');
    } else if (nextProps.deletedPost.post && !nextProps.deletedPost.error) { // delete success
      this.props.history.push('/community');
    } // else if (this.props.user.user && !nextProps.user.user) {
    // logout (had user(this.props.user.user) but no loger the case (!nextProps.user.user))
    // this.context.router.push('/');
    // }
  }

  componentWillUnmount() {
    // Important! If your component is navigating based on
    // some global state(from say componentWillReceiveProps)
    // always reset that global state back to null when you REMOUNT
    this.props.resetMe();
  }

  toggleEdit() {
    this.setState({
      editMode: !this.state.editMode
    });
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
    const { post, loading, error } = this.props.activePost;
    const { handleSubmit, submitting, newPost } = this.props;
    if (loading) {
      return <div className="container">Loading...</div>;
    } else if (error) {
      return <div className="alert alert-danger">{error.message}</div>;
    } else if (!post) {
      return <span />;
    }

    const editView = (
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
          <a onClick={this.toggleEdit} onKeyDown={this.toggleEdit} role="button" tabIndex={0}>Cancel</a>
        </div>
      </div>
    );
    const detailView = (
      <div className="card">
        <div className="card-content">
          <span className="card-title">{post.title}</span>
          <h6>Categories: {post.categories}</h6>
          <p>{post.contents}</p>
        </div>
        <div className="card-action">
          <Link to="/community">Back</Link>
          <a
            onClick={this.toggleEdit}
            onKeyDown={this.toggleEdit}
            role="button"
            tabIndex={0}
          >
            Edit
          </a>
          <a
            onClick={this.props.onDeleteClick}
            onKeyDown={this.props.onDeleteClick}
            role="button"
            tabIndex={0}
          >
            Delete
          </a>
        </div>
      </div>
    );

    return (
      <div className="container">
        { this.state.editMode ? editView : detailView }
      </div>
    );
  }
}

export default reduxForm({
  validatePost,
  form: 'PostEditForm'
})(
  withRouter(PostShow)
);
