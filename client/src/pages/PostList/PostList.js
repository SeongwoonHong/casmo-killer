import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
import RenderPosts from '../../components/Post/RenderPosts/RenderPosts';

class PostList extends Component {
  componentWillMount() {
    this.props.fetchPosts();
  }

  render() {
    const { posts, loading, error } = this.props.postsList;
    if (loading) {
      return (<ReactLoading type="spin" color="#008081" />);
    } else if (error) {
      return (<div className="alert alert-danger">Error: {error.message}</div>);
    }

    return (
      <div className="container">
        <h1>Posts</h1>
        <ul className="nav  nav-pills navbar-right">
          <li role="presentation">
            <Link to="/community/post/new">
              New Post
            </Link>
          </li>
        </ul>
        <ul className="collection">
          <RenderPosts posts={posts} />
        </ul>
      </div>
    );
  }
}

export default PostList;
