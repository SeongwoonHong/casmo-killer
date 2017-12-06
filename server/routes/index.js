const express = require('express');
const post = require('./post');
const board = require('./board');

const router = express.Router();
router.use('/post', post);
router.use('/board', board);

module.exports = router;
