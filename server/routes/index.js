const express = require('express');

const router = express.Router();

const post = require('./post');
const user = require('./user');
const board = require('./board');

router.use('/post', post);
router.use('/user', user);
router.use('/board', board);

module.exports = router;
