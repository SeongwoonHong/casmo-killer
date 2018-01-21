const mongoose = require('mongoose');

const { Schema } = mongoose;
const type = 'POST_WRITE POST_LIKE POST_DISLIKE COMMENT_WRITE COMMENT_LIKE COMMENT_DISLIKE'.split(' ');

const Activity = new Schema({
  type: { type: String, enum: type },
  userId: { type: mongoose.Schema.Types.ObjectId },
  payload: {
    post: {
      postId: { type: mongoose.Schema.Types.ObjectId, ref: 'post' },
      commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
  },
  date: { type: Date, default: Date.now },
});

Activity.statics.createWritetActivity = function (userId, postId, writeType) {
  const activity = new this({
    type: writeType === 'comment' ? 'COMMENT_WRITE' : 'POST_WRITE',
    userId,
    payload: {
      post: {
        postId
      }
    }
  });
  return activity.save();
};

Activity.statics.createLikeActivity = function (userId, postId, commentId) {
  const activity = new this({
    type: commentId ? 'COMMENT_LIKE' : 'POST_LIKE',
    userId,
    payload: {
      post: {
        postId,
        commentId
      }
    }
  });
  return activity.save();
};

Activity.statics.createDisLikeActivity = function (userId, postId, commentId) {
  const activity = new this({
    type: commentId ? 'COMMENT_DISLIKE' : 'POST_DISLIKE',
    userId,
    payload: {
      post: {
        postId,
        commentId
      }
    }
  });
  return activity.save();
};


module.exports = mongoose.model('activity', Activity);
