import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { SubmissionError } from 'redux-form';
import PostInputForm from '../PostInputForm';
import ReplyNew from '../ReplyNew/ReplyNew';
import ReplyList from '../ReplyList/ReplyList';
import { editPost, editPostFailure, editPostSuccess } from '../../actions/post';

class PostShow extends Component {
  constructor(props) {
    super(props);
    const pathName = this.props.location.pathname;
    const indexOfPost = this.props.location.pathname.indexOf('/post');
    const upperUrl = pathName.substring(0, indexOfPost);
    this.state = {
      editMode: false,
      upperUrl
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
      this.props.history.push(this.state.upperUrl);
    }
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
  validateAndEditPost = (values, dispatch) => {
    const id = this.props.activePost.post._id;

    return dispatch(editPost(id, values, sessionStorage.getItem('jwtToken')))
      .then((result) => {
        // Note: Error's "data" is in result.payload.response.data (inside "response")
        // success's "data" is in result.payload.data
        if (result.payload.response && result.payload.response.status !== 200) {
          dispatch(editPostFailure(result.payload.response.data));
          throw new SubmissionError(result.payload.response.data);
        }
        // let other components know that everything is fine by updating the redux` state
        dispatch(editPostSuccess(result.payload.data.result));
        dispatch(this.toggleEdit());
        // ps: this is same as dispatching RESET_USER_FIELDS
      });
  };

  render() {
    const { post, loading, error } = this.props.activePost;

    if (loading) {
      return <div className="container">Loading...</div>;
    } else if (error) {
      return <div className="alert alert-danger">{error.message}</div>;
    } else if (!post) {
      return <span />;
    }

    const editView = (
      <PostInputForm
        postProp={this.props.editPostProp}
        validateAndPost={this.validateAndEditPost}
        toggleEdit={this.toggleEdit}
        formName="PostEditForm"
        title={post.title}
        contents={post.contents}
      />
    );
    const detailView = (
      <div className="card">
        <div className="card-content">
          <span className="card-title">{post.title}</span>
          <h6>Writer : {post.authorName}</h6>
          <h6>Created : {post.date}</h6>
          <p>{post.contents}</p>
        </div>
        <div className="card-action">
          <Link to={this.state.upperUrl}>Back</Link>
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
        <ReplyList
          comments={this.props.activePost.post.comments}
        />
        <ReplyNew
          onReply={this.props.handleReply}
          postId={this.props.activePost.post._id}
        />
      </div>
    );
  }
}

export default withRouter(PostShow);
