import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextButton from '../Button/TextButton/TextButton';
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
      this.props.onReply(this.state.comment, this.props.postId, this.props.replyComment);
      this.setState({
        comment: ''
      });
    }
  }
  render() {
    return (
      <div className="comment-new">
        {
          !this.props.isLoggedIn &&
          <div className="required-login-overlay">You need to login to leave a comment</div>
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
  onReply: () => {},
  isLoggedIn: true,
  replyComment: {
    status: 'INIT'
  }
};

CommentNew.propTypes = {
  postId: PropTypes.string,
  onReply: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  replyComment: PropTypes.object
};
export default CommentNew;
