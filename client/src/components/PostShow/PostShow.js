import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

class PostShow extends Component {

  render() {
    const { activePost } = this.props;

    return (
      <div className="postShow">
        <span className="card-title">{activePost.title}</span>
        <h6>Writer : {activePost.authorName}</h6>
        <h6>Created : {activePost.date}</h6>
        <p>{activePost.contents}</p>
      </div>
    );
  }
}

PostShow.defaultProps = {
  activePost: {},
};

PostShow.propTypes = {
  activePost: PropTypes.object,
};

export default withRouter(PostShow);
