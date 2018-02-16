import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import krStrings from 'react-timeago/lib/language-strings/ko';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import Quote from '../../Quote/Quote';
import './Comment.scss';

const formatter = buildFormatter(krStrings);

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false
    };
  }
  validateAndPost = (values) => {
    const { postId, commentId } = this.props;
    const contents = values[`comment${this.props.commentId}`].trim();
    if (typeof contents !== 'string' || !contents) {
      // Materialize.toast($('<span style="color: red">Content cannot be empty</span>'), 3000, 'rounded');
      return;
    }
    return this.props.updateCommentRequest(postId, commentId, contents).then(() => {
      if (this.props.updateComment.status === 'SUCCESS') {
        // Materialize.toast('<span style="color: teal">Your comment is updated!</span>', 2000, 'rounded');
      } else {
        // Materialize.toast($('<span style="color: red">Content cannot be empty</span>'), 3000, 'rounded');
      }
      this.setState({ edit: false });
    });
  }
  render() {
    const {
      comment, avatar, date, isEdited, likes, disLikes, index, form, parentAuthor, commentAuthor, parentCommentId, commentAuthorId, parentContent, handleSubmit
    } = this.props;
    console.log(this.props.user);
    const buttons = (
      <span>
        <i
          className="material-icons cursor"
          onClick={() => {
            if (this.state.edit) this.toggleEdit();
            else this.onDeleteHandler();
          }}
          role="presentation"
          onKeyDown={() => {}}
        >
          { this.state.edit ? 'cancel' : 'delete' }
        </i>
        {
          this.state.edit ?
            <i
              className="material-icons cursor"
              onClick={this.props.handleSubmit(this.validateAndPost)}
              onKeyDown={() => {}}
              role="presentation"
            >
              save
            </i> :
            <i
              className="material-icons cursor"
              onClick={this.toggleEdit}
              onKeyDown={() => {}}
              role="presentation"
            >
              edit
            </i>
        }
      </span>
    );
    return (
      <div className="comment">
        <div className="comment-header">
          <img src={avatar} alt={avatar} className="comment-avatar" />
          <span>
            <Link
              to={`/user/info/${commentAuthorId}`}
              >
              {commentAuthor}
            </Link>
            <div className="created">Created : <TimeAgo date={date} formatter={formatter} />{ isEdited && <span> (edited)</span>}</div>
          </span>
        </div>

        {
          parentAuthor
          && <Quote
            author={parentAuthor}
            quote={parentContent}
          />
        }
        <form name="replyForm" onSubmit={handleSubmit(this.validateAndPost)} ref={el => this.form = el}>
          { this.state.edit ? editView : <pre readOnly className="comment-body">{comment}</pre> }

          <div className="comment-footer">
            <div className="like-dislike">
              <img
                src="/like_icon.png"
                alt="like_icon"
                className="like-icon"
                ref={el => this.like = el }
                onClick={() => this.likesHandler(postId, 'comment', commentId)}
                onKeyDown={() => {}}
                role="presentation"
              />
              <span className="likes">{likes.length}</span>
              <img
                src="/dislike_icon.png"
                alt="dislike_icon"
                className="dislike-icon"
                ref={el => this.disLike = el}
                onClick={() => this.disLikesHandler(postId, 'comment', commentId)}
                onKeyDown={() => {}}
                role="presentation"
              />
              <span className="dislikes">{disLikes.length}</span>
            </div>
            <span className="buttons">
              {
                this.props.user.isLoggedIn &&
                <i
                  className="material-icons cursor"
                  role="presentation"
                  onKeyDown={() => {}}
                  onClick={this.replyComment}
                >
                  reply
                </i>
              }
              {
                this.props.user.displayName === commentAuthor ? buttons : undefined
              }
            </span>
          </div>
        </form>
      </div>
    );
  }
}

Comment.defaultProps = {
  user: {
    isLoggedIn: true,
    displayName: 'displayName'
  }
};

Comment.propTypes = {
  user: PropTypes.object
};

export default Comment;
