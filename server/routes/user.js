const express = require('express');
const multer = require('multer');
const Joi = require('joi');

const router = express.Router();
const upload = multer();

const isAuthenticated = require('../middlewares/isAuthenticated');
const imgCloudUtils = require('../utils/imgCloudUtils');
const socialAuth = require('../utils/socialAuth');
const jwtUtils = require('../utils/jwtUtils');
const mailUtils = require('../utils/mailer');

const User = require('../db/models/user');

// logout and get rid of the cookie
router.post('/logout', (req, res) => {

  res.cookie('ckToken', null, {
    maxAge: 0,
    httpOnly: true
  });

});

// check the user's login status when the client first loads.
router.get('/validate', isAuthenticated, async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .cookie('ckToken', null, {
          maxAge: 0,
          httpOnly: true
        })
        .status(401)
        .send();
    }

    return res.send({
      user: {
        strategy: user.strategy,
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar
      }
    });

  } catch (error) {

    return res
      .status(500)
      .send({
        message: 'Internal server error.'
      });

  }

});

// this is used to verify the user's password again when the user
// attempts to either change current password or delete the account.
router.post('/validate/password', isAuthenticated, async (req, res) => {

  if (!req.body.password) {

    return res
      .status(400)
      .send({
        message: 'Please provide password to continue.'
      });

  }

  try {

    const user = await User.findUserById(req.user._id);

    if (!user) {
      return res
        .status(403)
        .send({
          message: 'No user information is found in the database.'
        });
    }

    const verified = await user.verifyPassword(req.body.password);

    if (!verified) {
      return res
        .status(403)
        .send({
          message: 'Password is incorrect.'
        });
    }

    return res
      .status(204)
      .send();

  } catch (error) {

    return res
      .status(500)
      .send({
        error,
        message: 'Internal server error.'
      });
  }

});

// checks whether or not a given email address is already taken
router.get('/validate/email/:email', async (req, res) => {

  const { email } = req.params;

  if (!email) {

    return res
      .status(400)
      .send({
        message: 'Please provide email to continue.'
      });

  }

  try {

    const user = await User.findUserByEmail(email);

    res.send({ isDuplicate: !!user });

  } catch (error) {

    return res
      .status(500)
      .send({
        error,
        message: 'Internal server error.'
      });

  }

});

// checks whether or not a given display name is already taken
router.get('/validate/displayName/:displayName', async (req, res) => {

  const { displayName } = req.params;

  if (!displayName) {

    return res
      .status(400)
      .send({
        message: 'Please provide display name to continue.'
      });

  }

  try {

    const user = await User.findUserByDisplayName(displayName);

    res.send({ isDuplicate: !!user });

  } catch (error) {

    return res
      .status(500)
      .send({
        error,
        message: 'Internal server error.'
      });

  }

});

// validate social authentication information
// this will either log the existing user in
// or redirect the new social user to register page
router.post('/validate/social', async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    provider: Joi.string().required(),
    accessToken: Joi.string().required()
  }));

  if (validations.error) {

    return res
      .status(400)
      .send({
        error: validations.error,
        message: 'Incorrect user information provided.'
      });

  }

  let profile = null;

  try {

    const { provider, accessToken } = req.body;

    // fetch user's profile using provider's API
    profile = await socialAuth[provider](accessToken);

  } catch (error) {

    return res
      .status(500)
      .send({
        error,
        message: 'Failed to retrieve your social profile.'
      });

  }

  if (!profile) {

    return res
      .status(500)
      .send({
        message: 'Failed to retrieve your social profile.'
      });

  }

  // check first if there is a user with the same profile
  let dupUser = null;

  try {

    dupUser = await User.findUserBySocialProfile(profile);

  } catch (error) {

    return res
      .status(500)
      .send({
        error,
        message: 'Internal server error.'
      });

  }

  // if there is no user with the same social profile
  if (!dupUser) {

    // redirect to registration form
    return res.send({
      shouldRegister: true,
      profile: {
        strategy: profile.strategy,
        email: profile.email,
        displayName: profile.displayName,
        avatar: profile.avatar
      }
    });

  }

  // check if the same email is already registered
  try {

    const emailDup = await User.findUserByEmail(profile.email);

    // let the user know about the email being already taken
    if (emailDup) {

      return res
        .status(403)
        .send({
          message: 'Your email is already registered.'
        });

    }

  } catch (error) {

    return res
      .status(500)
      .send({
        error,
        message: 'Internal server error.'
      });

  }

  // if it's an existing user, just log in
  const accessToken = await dupUser.generateToken();

  return res
    .cookie('ckToken', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    }).send({
      user: {
        strategy: dupUser.strategy,
        _id: dupUser._id,
        email: dupUser.email,
        displayName: dupUser.displayName,
        avatar: dupUser.avatar
      }
    });

});

// log in process for local (email & password) users
router.post('/signin/local', async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  }));

  if (validations.error) {

    return res
      .status(400)
      .send({
        error: validations.error,
        message: 'Incorrect email or password.'
      });

  }

  const { email, password } = req.body;

  try {

    const user = await User.findUserByEmail(email);

    if (user) {

      const {
        _id,
        displayName,
        avatar,
        strategy
      } = user;

      // if the email is registered with a social network authentication
      if (strategy !== 'local') {

        const provider = strategy[0].toUpperCase() + strategy.substr(1, strategy.length - 1);

        // let the user know which provider the email is registered with
        return res
          .status(403)
          .send({
            message: `Your email is already registered with ${provider}.`
          });
      }

      // verify the password
      const verified = await user.verifyPassword(password);

      if (!verified) {
        return res
          .status(403)
          .send({
            message: 'Incorrect email or password.'
          });
      }

      // generate access token and set it to cookie
      const accessToken = await user.generateToken();

      return res
        .cookie('ckToken', accessToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7
        }).send({
          user: {
            _id,
            email,
            displayName,
            avatar,
            strategy
          }
        });

    }

    return res
      .status(403)
      .send({
        message: 'No account exists with this email address.'
      });

  } catch (error) {

    // TODO: need to find a way to parse mongodb error and send it back to the client
    return res
      .status(500)
      .send({
        error,
        message: 'Internal server error.'
      });

  }

});

// registering a new local user
router.post('/signup/local', upload.any(), async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    email: Joi.string().email().required(),
    displayName: Joi.string().required(),
    avatar: Joi.string().allow(''),
    password: Joi.string().required()
  }));

  if (validations.error) {

    return res
      .status(400)
      .send({
        error: validations.error,
        message: 'Incorrect user information provided.'
      });

  }

  const {
    email,
    password,
    displayName,
    avatar
  } = req.body;

  // first upload the avatar image to cloudinary and get the url
  let avatarUrl = null;

  if (avatar) {

    try {

      avatarUrl = await imgCloudUtils.upload(avatar, displayName);

    } catch (error) {

      return res
        .status(500)
        .send({
          error,
          message: 'Failed to upload the profile photo.'
        });

    }

  }

  try {

    // save the new user to the database
    const user = await User.registerLocalUser({
      email,
      password,
      displayName,
      avatar: avatarUrl
    });

    const accessToken = await user.generateToken();

    return res
      .cookie('ckToken', accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
      }).send({
        strategy: user.strategy,
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar
      });

  } catch (error) {

    return res
      .status(500)
      .send({
        error,
        message: 'Internal server error.'
      });

  }

});

// registering a new social user
router.post('/signup/social', upload.any(), async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    email: Joi.string().email().required(),
    displayName: Joi.string().required(),
    avatar: Joi.string().allow(''),
    strategy: Joi.string().valid(['facebook', 'google', 'kakao']),
    socialId: Joi.string().required(),
    socialToken: Joi.string().required(),
  }));

  if (validations.error) {

    return res
      .status(400)
      .send({
        error: validations.error,
        message: 'Incorrect user information provided.'
      });

  }

  const {
    strategy,
    email,
    displayName,
    avatar,
    socialId,
    socialToken
  } = req.body;

  let avatarUrl;

  if (avatar) {

    try {

      avatarUrl = await imgCloudUtils.upload(avatar, displayName);

    } catch (error) {

      return res
        .status(500)
        .send({
          error,
          message: 'Failed to register the profile photo.'
        });

    }

  }

  try {

    const user = await User.registerSocialUser({
      strategy,
      email,
      displayName,
      avatar: avatarUrl || null,
      socialId,
      socialToken
    });

    const accessToken = await user.generateToken();

    return res
      .cookie('ckToken', accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
      }).send({
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar
      });

  } catch (error) {

    return res
      .status(500)
      .send({
        error,
        message: 'Internal server error.'
      });

  }

});

router.post('/signup/request', async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    email: Joi.string().email().required()
  }));

  if (validations.error) {

    return res
      .status(400)
      .send({
        error: validations.error,
        message: 'Incorrect email provided.'
      });

  }

  const { email } = req.body;

  // TODO: better error handling
  const token = await jwtUtils.sign({ email }, '24hrs');

  const { envelope } = await mailUtils.sendVerification(token, email);

  return res.send({
    message: `Verification email has been sent to ${envelope.to}`
  });

});

router.put('/update/password', isAuthenticated, async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    newPassword: Joi.string().required()
  }));

  if (validations.error) {

    return res
      .status(400)
      .send({
        error: validations.error,
        message: 'Invalid Password.'
      });

  }

  try {

    const user = await User.findUserById(req.user._id);

    if (!user) {
      return res
        .status(403)
        .send({
          message: 'Authenticaion Failed.'
        });
    }

    user.password = req.body.newPassword;

    user
      .save()
      .then(() => {
        return res
          .status(204)
          .send();
      })
      .catch((error) => {
        return res
          .status(500)
          .send({
            error,
            message: 'Internal server error.'
          });
      });

  } catch (error) {

    return res
      .status(500)
      .send({
        error,
        message: 'Internal server error.'
      });

  }

});

router.put('/update/all', isAuthenticated, async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    email: Joi.string().email().required(),
    displayName: Joi.string().required(),
    avatar: Joi.string().allow('')
  }));

  if (validations.error) {

    return res
      .status(400)
      .send({
        error: validations.error,
        message: 'Incorrect user information provided.'
      });

  }

  try {

    const user = await User.findUserById(req.user._id);

    if (!user) {
      return res
        .status(403)
        .send({
          message: 'Authenticaion Failed.'
        });
    }

    Object
      .keys(req.body)
      .forEach((key) => {
        user[key] = req.body[key];
      });

    const modifiedUser = await user.save();

    const accessToken = await modifiedUser.generateToken();

    return res
      .cookie('ckToken', accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
      }).send({
        _id: modifiedUser._id,
        email: modifiedUser.email,
        displayName: modifiedUser.displayName,
        avatar: modifiedUser.avatar
      });

  } catch (error) {

    return res
      .status(500)
      .send({
        error,
        message: 'Internal server error.'
      });

  }

});

router.get('/verify/email/:email', async (req, res) => {

  const { email } = await jwtUtils.verify(req.params.email);

  res.send(email);

});

module.exports = router;
