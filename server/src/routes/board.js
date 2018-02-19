const express = require('express');
const Board = require('../db/models/board');
const User = require('../db/models/user');

const router = express.Router();

/* GET SEARCH ALL BOARD LIST */
router.get('/all/search/:searchWord', (req, res) => {

  const { searchWord } = req.params;
  const searchCondition = { $regex: searchWord };

  Board.aggregate([
    {
      "$match": {
        "deleted": false,
        $or: [
          { boardId: searchCondition },
          { description: searchCondition }
        ]
      }
    },
    {
      "$lookup": {
        "localField": "author", // 기본 키
        "from": "users", // join 할 collection명
        "foreignField": "_id", // 외래 키
        "as": "author" // 결과를 배출할 alias ( 필드명 )
      }
    },
    {
      "$lookup": {
          "from": "posts", // <-- collection to join
          "localField": "boardId",
          "foreignField": "boardId",
          "as": "postCount"
      }
    },
    {
      "$project": {
        author: 1,
        boardId: 1,
        date: 1,
        description: 1,
        postsCount: {"$size": {
            $filter : {
                input: "$postCount",
                as : "postCount_field",
                cond : {
                    $eq: ["$$postCount_field.deleted",false]
                }
            }
        }}
      }
    }
  ]).exec(function(err, Result){
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Could not retrieve boards'
      });
    }
    res.json(Result);
  });
});

/* GET ALL BOARD LIST */
router.get('/all', (req, res) => {
  Board.aggregate([
    {
      "$match": {
        "deleted": false
      }
    },
    {
      "$lookup": {
        "localField": "author", // 기본 키
        "from": "users", // join 할 collection명
        "foreignField": "_id", // 외래 키
        "as": "author" // 결과를 배출할 alias ( 필드명 )
      }
    },
    {
      "$lookup": {
          "from": "posts", // <-- collection to join
          "localField": "boardId",
          "foreignField": "boardId",
          "as": "postCount"
      }
    },
    {
      "$project": {
        author: 1,
        boardId: 1,
        date: 1,
        description: 1,
        postsCount: {"$size": {
            $filter : {
                input: "$postCount",
                as : "postCount_field",
                cond : {
                    $eq: ["$$postCount_field.deleted",false]
                }
            }
        }}
      }
    }
  ]).exec(function(err, Result){
    res.json(Result);
  });
});

/* GET BOOKMARK BOARD LIST */
router.get('/bookmark/:user', (req, res) => {
  User.findById(req.params.user).then(
    (user) => {
      Board.find({ _id: user.bookmarked, deleted: false })
        .exec((err, boards) => {
          if (err) throw err;
          res.json(boards);
        });
    }
  );
});

/* GET MY BOARD LIST */
router.get('/my/:user', (req, res) => {
  Board.find({ author: req.params.user, deleted: false })
    .exec((err, boards) => {
      if (err) throw err;
      res.json(boards);
    });
});

/* CREATE BOARD */
router.post('/', (req, res) => {
  const { body } = req;
  const { boardId } = body;
  const { description } = body;

  // simulate error if title, categories and content are all "test"
  // This is demo field-validation error upon submission.
  if (boardId === 'test' && description === 'test') {
    return res.status(403).json({
      message: 'Title Error - Cant use "test" in all fields!'
    });
  }

  if (!boardId || !description) {
    return res.status(400).json({
      message: 'Error title and content are all required!'
    });
  }
  Board.findOne({ boardId }, (err, result) => {
    if (result) {
      return res.status(500).json({
        message: `Title Error - Cant use board ID ${boardId}!`
      });
    }
    req.body.author = req.user._id;

    Board.create(req.body, (error, boardResult) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: 'Could not save board'
        });
      }
      res.json(boardResult);
    });
  });
});

/* BOOKMARK BOARD */
router.post('/bookmark', (req, res) => {
  const { body } = req;
  const { boardId } = body;
  const { user } = body;
  let bookmarked = false;

  User.findById({ _id: user._id }, (err, result) => {
    for (let i = 0; i < result.bookmarked.length; i += 1) {
      if (result.bookmarked[i] == boardId) {
        bookmarked = true;
        result.bookmarked.remove(boardId);
      }
    }

    if (!bookmarked) {
      result.bookmarked.push(boardId.toString());
    }

    result.save((errResult, bookmarkResult) => {
      if (errResult) {
        return res.status(500).json({
          message: 'Could not save bookmark'
        });
      }
      res.json(bookmarkResult);
    });
  });
});

module.exports = router;
