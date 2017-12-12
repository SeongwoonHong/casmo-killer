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
            commentAuthorName={comment.name}
            comment={comment.memo}
            date={comment.date}
            commentId={comment._id}
            key={comment.date}
            postId={this.props.activePost._id}
            postAuthorName={this.props.activePost.authorName}
            authorId={this.props.activePost.authorId}
            avatar={comment.avatar}
            likes={comment.likes}
            disLikes={comment.disLikes}
            index={index}
            form={`form-${index}`}
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
