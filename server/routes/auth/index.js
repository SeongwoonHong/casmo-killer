const router = require('express').Router();
const upload = require('multer')({
  limits: {
    fieldSize: 50 * 1024 * 1024
  }
});

const controller = require('./controller');

/**
 * sends out a verification email to a given email address,
 * which will contain a link to the registration page.
 */
router.post('/request/verification', controller.requestVerification);

/**
 * decodes a token and returns the decoded email
 * to be used for new user registration
 */
router.get('/verify/token/:token', controller.verifyToken);

/**
 * check for a duplicate email address
 */
router.get('/verify/email/:email', controller.verifyEmail);

/**
 * check for a duplicate display name
 */
router.get('/verify/displayName/:displayName', controller.verifyDisplayName);

/**
 * log the user in using local strategy
 * using email and password
 */
router.post('/login/local', controller.localLogin);

/**
 * registers a new local user
 */
router.post('/register/local', upload.any(), controller.localRegister);

/**
 * log the user in using social network service
 * using social authentication apis
 */
router.post('/login/social', controller.socialLogin);

/**
 * registers a new social user
 */
router.post('/register/social', upload.any(), controller.socialRegister);

module.exports = router;
