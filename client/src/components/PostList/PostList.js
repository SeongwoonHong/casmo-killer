import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Post from './Post/Post';

class PostList extends Component {

  render() {
    const { postsList, baseUrl } = this.props;
    const mapToComponents = (data) => {
      return data.map((post) => {
        return (
          <Post
            id={post._id}
            postNum={post.postNum}
            authorName={post.authorName}
            categories={post.categories}
            title={post.title}
            count={post.count}
            key={post._id}
            baseUrl={baseUrl}
          />
        );
      });
    };

    return (
      <ul className="collection">
        {mapToComponents(postsList)}
      </ul>
    );
  }
}

PostList.defaultProps = {
  postsList: [],
  baseUrl: ''
};

PostList.propTypes = {
  postsList: PropTypes.array,
  baseUrl: PropTypes.string
};

export default PostList;
