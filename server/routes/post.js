/* eslint-disable max-len */
const express = require('express');
const mongoose = require('mongoose');
const Post = require('../db/models/post');
const comment = require('./comment');
const isAuthenticated = require('../middlewares/isAuthenticated');
const Board = require('../db/models/board');

const router = express.Router();
const PER_PAGE = 10;

// sub routes for comments
router.use('/comment', comment);

/* POST DETAIL */
router.get('/detail/:id', (req, res) => {
  Post.findById({
    _id: req.params.id
  })
    .populate('author')
    .populate('comments.author')
    .exec((err, post) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Could not retrieve post w/ that id'
        });
      }
      if (!post) {
        return res.status(404).json({
          message: 'Post not found'
        });
      }

      post.count += 1;
      post.save((errCount) => { // view count
        if (errCount) throw errCount;
      });
      res.json(post);
    });
});

/* GET SEARCH USER POSTS */
router.get('/search/userModalInfo/:searchWord', (req, res) => {
  const { searchWord } = req.params;
  const searchCondition = { $regex: searchWord };
  searchOption = {
    deleted: false,
    authorName: searchCondition
  };

  Post
    .find(searchOption)
    .populate('author')
    .sort({
      postNum: -1
    })
    .exec((error, posts) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: 'Could not retrieve posts'
        });
      }

      const json = {
        posts
      };
      res.json(json);
    });

});

/* GET SEARCH POSTS */
router.get('/search/:searchWord/:boardId/:page', (req, res) => {
  const skipSize = (req.params.page - 1) * PER_PAGE;
  let pageNum = 1;
  const { searchWord } = req.params;
  const searchCondition = { $regex: searchWord };
  let searchOption;
  if (req.params.boardId === 'userModalInfo') {
    searchOption = {
      deleted: false,
      authorName: searchCondition
    };
  } else {
    searchOption = {
      deleted: false,
      boardId: req.params.boardId,
      $or: [
        { title: searchCondition },
        { contents: searchCondition },
        { authorName: searchCondition }
      ]
    };
  }
  Post.count(searchOption, (err, totalCount) => {
    if (err) throw err;
    pageNum = Math.ceil(totalCount / PER_PAGE);
    Post
      .find(searchOption)
      .sort({
        postNum: -1
      })
      .populate('author')
      .skip(skipSize)
      .limit(PER_PAGE)
      .exec((error, posts) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: 'Could not retrieve posts'
          });
        }
        const meta = {
          limit: PER_PAGE,
          pagination: pageNum
        };

        const json = {
          meta,
          posts
        };
        res.json(json);
      });
  });
});
// GIVING LIKES FOR POSTS
// @Params:
//  postId: 좋아요 눌러질 포스트의 아이디
router.post('/likes/:postId', isAuthenticated, (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
    return res.status(400).json({
      message: 'INVALID POST ID'
    });
  }
  Post.findById(req.params.postId, (err, post) => {
    if (err) throw err;
    if (!post) return res.status(404).json({ message: 'NO SUCH POST' });
    const didDisLike = post.disLikes.indexOf(req.user.username) !== -1;
    if (didDisLike) {
      post.disLikes.splice(post.disLikes.indexOf(req.user.username), 1);
    }
    const index = post.likes.indexOf(req.user.username);
    const didLike = (index !== -1);
    if (!didLike) {
      post.likes.push(req.user.username);
    } else {
      post.likes.splice(index, 1);
    }
    post.save((error, result) => {
      if (error) throw error;
      post
        .populate('comments.author')
        .populate('author', (err2, finalResult) => {
          if (err2) throw err2;
          return res.json(finalResult);
        });
      // return res.json(result);
    });
  });
});

// GIVING DISLIKES FOR POSTS
// @Params:
//  postId: 싫어요 눌러질 포스트의 아이디
router.post('/disLikes/:postId', isAuthenticated, (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
    return res.status(400).json({
      message: 'INVALID POST ID'
    });
  }

  Post.findById(req.params.postId, (err, post) => {
    if (err) throw err;
    if (!post) return res.status(404).json({ message: 'NO SUCH POST' });
    const didLike = post.likes.indexOf(req.user.username) !== -1;
    if (didLike) {
      post.likes.splice(post.disLikes.indexOf(req.user.username), 1);
    }
    const index = post.disLikes.indexOf(req.user.username);
    const didDislike = (index !== -1);
    if (!didDislike) {
      post.disLikes.push(req.user.username);
    } else {
      post.disLikes.splice(index, 1);
    }
    post.save((error, result) => {
      if (error) throw error;
      post
        .populate('comments.author')
        .populate('author', (err2, finalResult) => {
          if (err2) throw err2;
          return res.json(finalResult);
        });
    });
  });
});
/* GET POST LIST */
router.get('/:boardId/:page/:sortType', (req, res) => {
  const skipSize = (req.params.page - 1) * PER_PAGE;
  let pageNum = 1;
  const sortObject = {};
  const stype = req.params.sortType;
  sortObject[stype] = -1;

  Board.findOne({ boardId: req.params.boardId })
    .populate('author')
    .exec((errBoard, resultBoard) => {
      if (resultBoard) {
        Post.count({ deleted: false, boardId: req.params.boardId }, (err, totalCount) => {
          if (err) throw err;

          pageNum = Math.ceil(totalCount / PER_PAGE);
          Post
            .find({ deleted: false, boardId: req.params.boardId })
            .populate('author')
            .sort(sortObject)
            .skip(skipSize)
            .limit(PER_PAGE)
            .exec((error, posts) => {
              if (error) {
                console.log(error);
                return res.status(500).json({
                  message: 'Could not retrieve posts'
                });
              }

              const meta = {
                limit: PER_PAGE,
                pagination: pageNum,
                author: resultBoard.author
              };

              const json = {
                meta,
                posts
              };
              res.json(json);
            });
        });
      } else {
        return res.status(400).json({
          message: `There is no board ${req.params.boardId}`
        });
      }
    });
});

/* CREATE REPLY */
router.post('/reply', (req, res) => {
  const { body } = req;
  const { comment } = body;
  const { parentAuthor, parentCommentId, parentContent } = body.parentReply;
  // simulate error if title, categories and content are all "test"
  // This is demo field-validation error upon submission.
  if (comment === 'test') {
    return res.status(403).json({
      message: {
        // categories: 'Categories Error',
        content: 'Content Error'
      }
    });
  }
  if (!comment) {
    return res.status(400).json({
      message: 'Error: content is required!'
    });
  }

  Post.findOne({ _id: req.body.postId }, (err, rawContent) => {
    if (err) throw err;
    rawContent.comments.push({
      author: req.user._id,
      memo: comment,
      avatar: req.user.avatar,
      parentAuthor,
      parentCommentId,
      parentContent
    });
    rawContent.save((error, replyResult) => {
      if (error) throw error;
      rawContent
        .populate('author')
        .populate('comments.author', (errComment, commentResult) => {
          return res.json(commentResult);
        });
    });
  });
});

/* SUBMIT POST */
router.post('/:boardId', isAuthenticated, (req, res) => {
  const { body } = req;
  const { title } = body;
  const { contents } = body;

  // simulate error if title, categories and content are all "test"
  // This is demo field-validation error upon submission.
  if (title === 'test' && contents === 'test') {
    return res.status(403).json({
      message: 'Title Error - Cant use "test" in all fields!'
    });
  }

  if (!title || !contents) {
    return res.status(400).json({
      message: 'Error title and content are all required!'
    });
  }

  req.body.author = req.user._id;
  req.body.boardId = req.params.boardId;
  req.body.avatar = req.user.avatar;
  Post.create(req.body, (err, postResult) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Could not save post'
      });
    }
    res.json(postResult);
  });
});

/* POST DELETE */
router.delete('/:id', (req, res) => {
  Post.findOneAndUpdate({ _id: req.params.id },
    { deleted: true }, { runValidators: true, new: true }, (err, result) => {
      if (err) {
        throw err;
      }
      if (!result) {
        return res.status(404).json({
          message: 'Could not delete post'
        });
      }
      res.json({
        result: 'Post was deleted'
      });
    });
});

/* EDIT POST */
router.put('/:id', async (req, res) => {
  const { body } = req;
  const { title } = body;
  const { contents } = body;
  // simulate error if title, categories and content are all "test"
  // This is demo field-validation error upon submission.
  if (title === 'test' && contents === 'test') {
    return res.status(403).json({
      message: 'Title Error - Cant use "test" in all fields!'
    });
  }

  // CHECK CONTENTS VALID
  if (typeof req.body.contents !== 'string') {
    return res.status(400).json({
      message: 'INVALID CONTENTS'
    });
  }

  await Post.findOne({ _id: req.params.id }, (err, originContent) => {
    if (err) throw err;
    originContent.updated.push({ title: originContent.title, contents: originContent.contents });
    originContent.save((errOrigin) => {
      if (errOrigin) throw errOrigin;
    });
  });

  Post.findOneAndUpdate({ _id: req.params.id },
    req.body, { runValidators: true, new: true }, (err, post) => {
      if (err) {
        throw err;
      }
      post
        .populate('author')
        .populate('comments.author', (error, result) => {
          if (error) throw error;
          res.json(result);
        });
    });
});


module.exports = router;
