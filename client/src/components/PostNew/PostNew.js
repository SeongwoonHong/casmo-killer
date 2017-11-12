import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import PostInputForm from '../PostInputForm';
import { createPost, createPostFailure, createPostSuccess } from '../../actions/post';

class PostNew extends Component {
  constructor(props) {
    super(props);
    const pathName = this.props.location.pathname;
    const indexOfPost = this.props.location.pathname.indexOf('/post');
    const upperUrl = pathName.substring(0, indexOfPost);
    this.state = {
      upperUrl
    };
  }
  componentWillMount() {
  // Important! If your component is navigating based on
  // some global state(from say componentWillReceiveProps)
  // always reset that global state back to null when you REMOUNT
    this.props.resetMe();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newPost.post && !nextProps.newPost.error) {
      this.props.history.push(`${this.state.upperUrl}/post/${nextProps.newPost.post._id}`);
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

  render() {
    return (
      <div className="container">
        <PostInputForm
          postProp={this.props.newPost}
          validateAndPost={this.validateAndCreatePost}
          formName="PostsNewForm"
          cancelUrl={this.state.upperUrl}
        />
      </div>
    );
  }
}

export default PostNew;
