import React, { Component } from 'react';
import Comment from './Comment';
import PropTypes from 'prop-types';

import './CommentList.scss';

class CommentList extends Component {
  render() {
    // console.log(this.props.activePost);
    // const { data } = this.props.activePost;
    // const { comments } = data;
    return (
      <div id="comment-list-container">
        {
          this.props.comments.map((comment, index) => {
            return (
              <Comment
                commentAuthor={comment.author.displayName}
                commentAuthorId={comment.author.$oid}
                // postAuthor={this.props.activePost.author}
                updateComment={this.props.updateComment} // from article container
                user={this.props.user} // from article container
                avatar={comment.avatar}
                comment={comment.memo}
                date={comment.date}
                key={comment._id}
                // postId={this.props.activePost._id}
                isEdited={comment.isEdited}
                likes={comment.likes}
                disLikes={comment.disLikes}
                index={index}
                form={`form-${index}`}
                commentId={comment._id}
                parentAuthor={comment.parentAuthor}
                parentCommentId={comment.parentCommentId}
                parentContent={comment.parentContent}
                // openUserInfoModal={this.props.openUserInfoModal}
              />
            );
          })
        }
      </div>
    );
  }
}
CommentList.defaultProps = {
  comments: [
    {
      'author': {
        'displayName': 'displayName', // 이거 임시로 해논거. 나중에는 파퓰레이트로 해서 필요없음.
        '$oid': '5a56bdb2faf88903303b0a62'
      },
      'memo': 'cvvvvvaziwueruycvvvvvaziwueruycvvvvvaziwueruycvvvvvaziwueruycvvvvvaziwueruycvvvvvaziwueruycvvvvvaziwueruycvvvvvcvvvvvaziwueruycvvvvvaziwueruycvvvvvaziwueruycvvvvvaziwueruycvvvvvaziwueruycvvvvvaziwueruyaziwueruy',
      'avatar': 'https://res.cloudinary.com/duk5vdxcc/image/upload/c_fill,h_100,w_100/v1515634097/seong1.jpg',
      'parentAuthor': null,
      'parentContent': null,
      '_id': {
        '$oid': '5a6151adec951107a56cda8a'
      },
      'isEdited': true,
      'deleted': true,
      'disLikes': [],
      'likes': [],
      'date': {
        '$date': '2018-01-19T02:02:21.038Z'
      }
    },
    {
      'author': {
        'displayName': 'displayName', // 이거 임시로 해논거. 나중에는 파퓰레이트로 해서 필요없음.
        '$oid': '5a56bdb2faf88903303b0a69'
      },
      'memo': 'ffff',
      'avatar': 'https://res.cloudinary.com/duk5vdxcc/image/upload/c_fill,h_100,w_100/v1515634097/seong1.jpg',
      '_id': {
        '$oid': '5a6151afec951107a56cda8b'
      },
      'isEdited': false,
      'deleted': false,
      'disLikes': [],
      'likes': [],
      'date': {
        '$date': '2018-01-19T02:02:23.074Z'
      }
    }
  ]
}

CommentList.propTypes = {
  comments: PropTypes.array
};
export default CommentList;
