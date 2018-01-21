const express = require('express');
const mongoose = require('mongoose');
const Post = require('../db/models/post');
const isAuthenticated = require('../middlewares/isAuthenticated');
const Activity = require('../db/models/activity');

const router = express.Router();

// UPDATING COMMENT
// @Params:
//  commentId: 업데이트될 코멘트 아이디
router.post('/update/:postId/:commentId', isAuthenticated, (req, res) => {
  const { postId, commentId } = req.params;
  const { contents } = req.body;
  if (contents.trim() === '') {
    return res.status(400).json({ message: 'COMMENT CANNOT BE EMPTY' });
  }
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({
      message: 'INVALID POST ID'
    });
  }
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({
      message: 'INVALID COMMENT ID'
    });
  }
  Post.findById(postId, (err, post) => {
    if (err) throw err;
    if (!post) return res.status(404).json({ message: 'NO SUCH DATA' });
    for (let i = 0; i < post.comments.length; i += 1) {
      if (post.comments[i]._id == commentId) {
        post.comments[i].memo = contents;
        post.comments[i].isEdited = true;
      }
    }
    post.save((error, result) => {
      if (error) throw error;
      post
        .populate('comments.author', (errComment, commentResult) => {
          return res.json(commentResult.comments);
        });
    });
  });
});

// GIVING LIKES FOR COMMENTS
// @Params:
//  postId: 좋아요 눌러질 포스트의 아이디
//  commentId: 좋아요 눌러질 코멘트 아이디
router.post('/likes/:postId/:commentId', isAuthenticated, (req, res) => {
  const { postId, commentId } = req.params;
  let commentAuthor;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({
      message: 'INVALID POST ID'
    });
  }
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({
      message: 'INVALID COMMENT ID'
    });
  }
  Post.findById(postId, (err, post) => {
    if (err) throw err;
    if (!post) return res.status(404).json({ message: 'NO SUCH POST' });
    for (let i = 0; i < post.comments.length; i += 1) {
      if (post.comments[i]._id == commentId) {
        const index = post.comments[i].likes.indexOf(req.user.displayName);
        const didDisLike = post.comments[i].disLikes.indexOf(req.user.displayName) !== -1;
        commentAuthor = post.comments[i].author;

        if (didDisLike) {
          post.comments[i].disLikes.splice(post.comments[i].disLikes.indexOf(req.user.displayName), 1);
        }
        const didLike = (index !== -1);
        if (!didLike) {
          // IF IT DOES NOT EXIST
          post.comments[i].likes.push(req.user.displayName);
        } else {
          // ALREADY disliked
          post.comments[i].likes.splice(index, 1);
        }
      }
    }
    post.save((error, result) => {
      if (error) throw error;
      post
        .populate('author')
        .populate('comments.author', (errComment, commentResult) => {
          if (errComment) throw errComment;
          Activity.createLikeActivity(req.user._id, postId, commentAuthor);
          return res.json(commentResult);
        });
    });
  });
});

// GIVING DISLIKES FOR COMMENTS
// @Params:
//  postId: 싫어요 눌러질 포스트의 아이디
//  commentId: 싫어요 눌러질 코멘트 아이디
router.post('/disLikes/:postId/:commentId', isAuthenticated, (req, res) => {
  const { postId, commentId } = req.params;
  let commentAuthor;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({
      message: 'INVALID POST ID'
    });
  }
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({
      message: 'INVALID COMMENT ID'
    });
  }
  Post.findById(postId, (err, post) => {
    if (err) throw err;
    if (!post) return res.status(404).json({ message: 'NO SUCH POST' });
    for (let i = 0; i < post.comments.length; i += 1) {
      if (post.comments[i]._id == commentId) {
        const index = post.comments[i].disLikes.indexOf(req.user.displayName);
        const didLike = post.comments[i].likes.indexOf(req.user.displayName) !== -1;
        commentAuthor = post.comments[i].author;
        if (didLike) {
          post.comments[i].likes.splice(post.comments[i].likes.indexOf(req.user.displayName), 1);
        }
        const didDisLike = (index !== -1);
        if (!didDisLike) {
          // IF IT DOES NOT EXIST
          post.comments[i].disLikes.push(req.user.displayName);
        } else {
          // ALREADY disliked
          post.comments[i].disLikes.splice(index, 1);
        }
      }
    }
    post.save((error, result) => {
      if (error) throw error;
      post
        .populate('author')
        .populate('comments.author', (errComment, commentResult) => {
          if (errComment) throw errComment;
          Activity.createDisLikeActivity(req.user._id, postId, commentAuthor);
          return res.json(commentResult);
        });
    });
  });
});

// DELETING COMMENTS
// @Params:
//  postId: 삭제될 코멘트가있는 포스트의 아이디
//  commentId: 삭제될 코멘트의 아이디
router.post('/:postId/:commentId', isAuthenticated, (req, res) => {
  const { postId, commentId } = req.params;
  Post.update(
    { _id: postId, 'comments._id': commentId },
    { $set: { 'comments.$.deleted': true } },
    (err, result) => {
      if (err) throw err;
      if (!result) res.status(404).json({ message: 'NO SUCH COMMENT' });
      return res.json(result);
    }
  );
});

module.exports = router;
