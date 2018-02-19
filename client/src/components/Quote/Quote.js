import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Quote.scss';

class Quote extends Component {
  render() {
    const {
      author, content, isCloseButton, replyCommentReset
    } = this.props;
    return (
      <div className="quote">
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
        <div className="comment-author">
          { author } <span>wrote:</span>
        </div>
        <pre readOnly className="quote-comment">{content}</pre>
      </div>
    );
  }
}
Quote.defaultProps = {
  author: '',
  quote: '',
  isCloseButton: false,
  replyCommentReset: () => { console.warn('function replyCommentReset is not defined'); }
};

Quote.propTypes = {
  author: PropTypes.string,
  quote: PropTypes.string,
  isCloseButton: PropTypes.bool,
  replyCommentReset: PropTypes.func
};
export default Quote;
