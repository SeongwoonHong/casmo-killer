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
            authorName={post.author}
            comments={post.comments.length}
            title={post.title}
            count={post.count}
            key={post._id}
            baseUrl={baseUrl}
            date={post.date}
            page={this.props.page}
            selected={this.props.selected}
            openUserInfoModal={this.props.openUserInfoModal}
            closeAndRedirect={this.props.closeAndRedirect}
            closeUserInfoModal={this.props.closeUserInfoModal}
          />
        );
      });
    };

    return (
      <ul className="post_row collection col s6 m1 l1">
        {mapToComponents(postsList)}
      </ul>
    );
  }
}

PostList.defaultProps = {
  postsList: [],
  baseUrl: '',
  page: 0,
  selected: 0
};

PostList.propTypes = {
  postsList: PropTypes.array,
  baseUrl: PropTypes.string,
  page: PropTypes.number,
  selected: PropTypes.number
};

export default PostList;
