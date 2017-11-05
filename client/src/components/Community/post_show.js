import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { postDetailRequest } from '../../actions/post';

class PostsShow extends Component {
  constructor(props) {
    super(props);
    this.btnClick = this.btnClick.bind(this);
  }

  btnClick() {
    const { id } = this.props.match.params;
    this.props.deletePost(id, () => {
      this.props.history.push('/community');
    });
  }
  render() {
    console.log(this.props.post);
    const { post } = this.props;
    if (!post) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <Link className="btn btn-primary" to={`/${this.props.location.pathname.split('/')[1]}`}>
          Back to Posts
        </Link>
        <button
          className="btn btn-danger pull-xs-right"
          onClick={this.btnClick}
        >
          Delete Post
        </button>
        <h3>{post.title}</h3>
        <h6>Writer: {post.writer}</h6>
        <p>{post.content}</p>
      </div>
    );
  }
}

function mapStateToProps({ posts }, ownProps) {
  return { post: posts.list.data[ownProps.match.params.id] };
}
export default connect(mapStateToProps, { postDetailRequest })(PostsShow);
