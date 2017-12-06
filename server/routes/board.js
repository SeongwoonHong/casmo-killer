const express = require('express');
const Board = require('../models/board');

const router = express.Router();

/* GET BOARD LIST */
router.get('/', (req, res) => {
  Board.find({ deleted: false })
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

    req.body.authorName = 'gook';
    req.body.authorId = 'gook';

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

module.exports = router;
