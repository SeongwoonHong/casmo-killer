import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import ReplyOnReply from '../ReplyOnReply/ReplyOnReply';
import './ReplyNew.scss';

class ReplyNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleReply = this.handleReply.bind(this);
  }

  handleChange(e) {
    this.setState({
      comment: e.target.value
    });
  }

  handleReply() {
    if (this.state.comment.trim() !== '') {
      this.props.onReply(this.state.comment, this.props.postId, this.props.replyComment);
      this.setState({
        comment: ''
      });
    }
  }

  render() {
    return (
      <div className="card reply-new">
        {
          !this.props.isLoggedIn && <div className="required-login-overlay">You need to login to leave a comment</div>
        }
        <div className="card-content">
          {
            this.props.replyComment.status === 'WAITING' &&
            <ReplyOnReply
              author={this.props.replyComment.parentAuthor}
              content={this.props.replyComment.parentContent}
              replyCommentReset={this.props.replyCommentReset}
              isCloseButton
            />
          }
          <textarea
            id="reply"
            className="materialize-textarea"
            value={this.state.comment}
            onChange={this.handleChange}
          />
        </div>
        <div className="card-action">
          <Button
            onClick={this.handleReply}
            onKeyDown={this.handleReply}
            className="btn waves-effect teal waves-light"
            role="button"
            tabIndex={0}
            text={this.props.btnName}
            isLink={false}
          />
        </div>
      </div>
    );
  }
}

ReplyNew.defaultProps = {
  postId: '',
  title: '',
  btnName: 'Save',
  onReply: () => {}
};

ReplyNew.propTypes = {
  postId: PropTypes.string,
  title: PropTypes.string,
  btnName: PropTypes.string,
  onReply: PropTypes.func
};

export default ReplyNew;
