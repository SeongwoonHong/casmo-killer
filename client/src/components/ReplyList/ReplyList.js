import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TransitionGroup from 'react-transition-group-plus';
import Reply from '../Reply';


class ReplyList extends Component {

  render() {
    const { comments } = this.props;
    const mapToComponents = (data) => {
      return data.map((comment, index) => {
        return (
          !comment.deleted &&
          <Reply
            commentAuthor={comment.author.displayName}
            postAuthor={this.props.activePost.author}
            avatar={comment.avatar}
            comment={comment.memo}
            date={comment.date}
            key={comment.date}
            postId={this.props.activePost._id}
            isEdited={comment.isEdited}
            likes={comment.likes}
            disLikes={comment.disLikes}
            index={index}
            form={`form-${index}`}
            commentId={comment._id}
            parentAuthor={comment.parentAuthor}
            parentCommentId={comment.parentCommentId}
            parentContent={comment.parentContent}
            openUserInfoModal={this.props.openUserInfoModal}
            />
        );
      });
    };

    return (
      <div>
        <TransitionGroup component="div">
          {mapToComponents(comments)}
        </TransitionGroup>
      </div>
    );
  }
}

ReplyList.defaultProps = {
  comments: []
};

ReplyList.propTypes = {
  comments: PropTypes.array,
};

export default ReplyList;
