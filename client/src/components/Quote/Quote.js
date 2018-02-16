import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Quote.scss';

class Quote extends Component {
  render() {
    const {
      author, quote, isCloseButton, replyCommentReset
    } = this.props;
    return (
      <div className="quote">
        {
          isCloseButton &&
          <span
            className="close"
            onClick={replyCommentReset}
            role="presentation"
            onKeyDown={() => {}}
          >
            close
          </span>
        }
        <div className="reply-author">
          { author } <span>wrote:</span>
        </div>
        <pre readOnly className="reply-quote">{quote}</pre>
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
