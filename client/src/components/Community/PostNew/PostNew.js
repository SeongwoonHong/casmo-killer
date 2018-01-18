import React, { Component } from 'react';
import PostInputForm from '../../PostInputForm';

class PostNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardId: props.match.params.boardId
    };
  }

  validateAndCreatePost= (values) => {
    return this.props.createPostRequest(values, this.state.boardId).then(() => {
      if (this.props.newPost.status === 'SUCCESS') {
        this.props.history.push(`/article/${this.props.newPost.data._id}`).then(
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
    return (
      <div className="post_new">
        <PostInputForm
          validateAndPost={this.validateAndCreatePost}
          formName="PostsNewForm"
          cancelUrl={`/articles/${this.state.boardId}`}
        />
      </div>
    );
  }
}

export default PostNew;
