const router = require('express').Router();

const controller = require('./controller');

/**
 * fetch user activity
 */
router.get('/:userId', controller.getUserActivity);
router.get('/:userId/:listType/:id', controller.getUserOldActivity);

module.exports = router;
