const router = require('express').Router();
const upload = require('multer')({
  limits: {
    fieldSize: 50 * 1024 * 1024
  }
});

const controller = require('./controller');

/**
 * logout and remove the cookie
 */
router.post('/logout', controller.logout);

/**
 * check user's login status and update user information if updated
 */
router.get('/verify/status', controller.verifyLoginStatus);

/**
 * verify user's email once more before letting the user change the password
 * (only applicable to users using local strategy)
 */
router.post('/verify/password', controller.verifyPassword);

/**
 * update user's password
 */
router.put('/update/password', controller.updatePassword);

/**
 * update user's profile information, (excluding password)
 */
router.put('/update/profile', upload.any(), controller.updateProfile);

/**
 * update user's email
 */
router.put('/update/email', controller.updateEmail);

/**
 * permanently delete user's account
 */
router.delete('/delete/account', controller.deleteAccount);

module.exports = router;
