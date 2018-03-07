const router = require('express').Router();

const post = require('./post');
const board = require('./board');

const isAuthenticated = require('../middlewares/isAuthenticated');

router.use('/post', post);
router.use('/board', board);

router.use('/auth', require('./auth/index'));
router.use('/activity', require('./activity/index'));
router.use('/user', isAuthenticated, require('./user/index'));

module.exports = router;
