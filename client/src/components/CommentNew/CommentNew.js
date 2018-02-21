import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextButton from '../Button/TextButton/TextButton';
import Quote from '../Quote/Quote';
import './CommentNew.scss';

class CommentNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: ''
    };
  }

  handleChange = (e) => {
    this.setState({
      comment: e.target.value
    });
  }

  handleReply = () => {
    if (this.state.comment.trim() !== '') {
      this.props.createCommentRequest(this.state.comment, this.props.postId, this.props.replyComment);
      this.setState({
        comment: ''
      });
    }
  }
  render() {
    const {
      isLoggedIn, replyComment, replyCommentReset
    } = this.props;
    return (
      <div className="comment-new">
        {
          !isLoggedIn &&
          <div className="required-login-overlay">You need to login to leave a comment</div>
        }
        {
            replyComment.status === 'WAITING' &&
            <Quote
              author={replyComment.parentAuthor}
              content={replyComment.parentContent}
              replyCommentReset={replyCommentReset}
              isCloseButton
            />
          }
        <textarea
          id="reply"
          className="comment-new-body"
          value={this.state.comment}
          onChange={this.handleChange}
        />
        <TextButton
          onClick={this.handleReply}
          onKeyDown={this.handleReply}
          className=""
          role="button"
          tabIndex={0}
        >
          Save
        </TextButton>
      </div>
    );
  }
}

CommentNew.defaultProps = {
  postId: '',
  isLoggedIn: false,
  replyComment: {
    status: 'INIT'
  }
};

CommentNew.propTypes = {
  postId: PropTypes.string,
  isLoggedIn: PropTypes.bool,
  replyComment: PropTypes.object
};
export default CommentNew;
