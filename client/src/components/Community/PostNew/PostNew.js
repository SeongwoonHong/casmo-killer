import React, { Component } from 'react';
import PostInputForm from '../../PostInputForm';

class PostNew extends Component {
  constructor(props) {
    super(props);
    const pathName = this.props.location.pathname;
    const indexOfPost = this.props.location.pathname.indexOf('/new');
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
      this.props.history.push(`${this.state.upperUrl}/show/${nextProps.newPost.post._id}`);
    }
  }

  render() {
    return (
      <div className="container">
        <h1>Posts Input</h1>
        <PostInputForm
          postProp={this.props.newPost}
          validateAndPost={this.props.validateAndCreatePost}
          formName="PostsNewForm"
          cancelUrl={this.state.upperUrl}
        />
      </div>
    );
  }
}

export default PostNew;
