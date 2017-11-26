import React, { Component } from 'react';
import PostInputForm from '../../PostInputForm';
import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';

class PostNew extends Component {
  constructor(props) {
    super(props);
    const pathName = this.props.location.pathname;
    const indexOfPost = this.props.location.pathname.lastIndexOf('/');
    const currentUrl = pathName.substring(0, indexOfPost);
    this.state = {
      currentUrl,
      boardId: props.match.params.boardId
    };
  }

  validateAndCreatePost= (values) => {
    return this.props.createPostRequest(values, this.state.boardId).then(() => {
      if (this.props.newPost.status === 'SUCCESS') {
        this.props.history.push(`${this.state.currentUrl}/${this.props.newPost.data._id}`).then(
          () => {
            Materialize.toast('Success!', 2000);
          }
        );

      } else {
        Materialize.toast($(`<span style="color: #00c853">Error: ${this.props.newPost.error.message}</span>`), 3000);
      }
    });
  }

  render() {
    console.log(this.props.data);
    return (
      <div className="post_new">
        <BreadCrumbs url={this.props.location.pathname} />
        <PostInputForm
          validateAndPost={this.validateAndCreatePost}
          formName="PostsNewForm"
          cancelUrl={this.state.currentUrl}
        />
      </div>
    );
  }
}

export default PostNew;
