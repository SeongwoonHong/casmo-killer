import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import krStrings from 'react-timeago/lib/language-strings/ko';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

const formatter = buildFormatter(krStrings);

class PostShow extends Component {

  render() {
    const { activePost } = this.props;

    return (
      <div className="postShow">
        <span className="card-title">{activePost.title}</span>
        <h6>Writer : {activePost.authorName}</h6>
        <h6>Created : <TimeAgo date={activePost.date} formatter={formatter} /></h6>
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
