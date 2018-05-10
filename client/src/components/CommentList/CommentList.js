import React, { Component } from 'react';
import TransitionGroup from 'react-transition-group-plus';
import Comment from './Comment';


import './CommentList.scss';

class CommentList extends Component {
  render() {
    const {
      giveLikesRequest, giveDisLikesRequest, deleteCommentRequest, updateCommentRequest, replyCommentRequest
    } = this.props;
    return (
      <div id="comment-list-container">
        <TransitionGroup>
          {
            this.props.comments.map((comment, index) => {
              return (
                !comment.deleted &&
                <Comment
                  commentAuthor={comment.author.displayName}
                  commentAuthorId={comment.author._id}
                  updateComment={this.props.updateComment} // from article container
                  user={this.props.user} // from article container
                  avatar={comment.avatar}
                  comment={comment.memo}
                  date={comment.date}
                  key={comment._id}
                  postId={this.props.postId}
                  isEdited={comment.isEdited}
                  likes={comment.likes}
                  disLikes={comment.disLikes}
                  index={index}
                  form={`form-${index}`}
                  commentId={comment._id}
                  parentAuthor={comment.parentAuthor}
                  parentCommentId={comment.parentCommentId}
                  parentContent={comment.parentContent}
                  giveLikesRequest={giveLikesRequest}
                  giveDisLikesRequest={giveDisLikesRequest}
                  deleteCommentRequest={deleteCommentRequest}
                  updateCommentRequest={updateCommentRequest}
                  replyCommentRequest={replyCommentRequest}
                />
              );
            })
          }
        </TransitionGroup>
      </div>
    );
  }
}

export default CommentList;
