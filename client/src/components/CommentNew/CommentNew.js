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
      user, replyComment, replyCommentReset
    } = this.props;
    const header = (
      <div className="comment-header">
        <img src={user.avatar} alt={user.avatar} className="comment-avatar" />
        <span>{ user.displayName }</span>
      </div>
    );
    return (
      <div className="comment-new">
        {
          user.isLoggedIn && header
        }
        {
          !user.isLoggedIn &&
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
          placeholder="Leave a comment"
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
  user: {},
  replyComment: {
    status: 'INIT'
  }
};

CommentNew.propTypes = {
  postId: PropTypes.string,
  user: PropTypes.object,
  replyComment: PropTypes.object
};
export default CommentNew;
