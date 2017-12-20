import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ReplyOnReply.scss';

class ReplyOnReply extends Component {
  render() {
    const {
      author, content, isCloseButton, replyCommentReset
    } = this.props;
    return (
      <div className="reply-on-reply">
        {
          isCloseButton &&
          <i
            className="material-icons close"
            onClick={replyCommentReset}
            role="presentation"
            onKeyDown={() => {}}
          >
            close
          </i>
        }
        <div className="reply-author">
          { author }
        </div>
        <pre readOnly className="reply-content">{content}</pre>
      </div>
    );
  }
}
ReplyOnReply.defaultProps = {
  author: '',
  content: '',
  isCloseButton: false
};

ReplyOnReply.propTypes = {
  author: PropTypes.string,
  content: PropTypes.string,
  isCloseButton: PropTypes.bool
};
export default ReplyOnReply;
