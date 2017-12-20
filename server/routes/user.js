const express = require('express');
const router = express.Router();
const Joi = require('joi');
const multer = require('multer');
const upload = multer();

const isAuthenticated = require('../middlewares/isAuthenticated');
const imgCloudUtils = require('../utils/imgCloudUtils');
const socialAuthUtils = require('../utils/socialAuthUtils');

const User = require('../db/models/user');

router.post('/logout', (req, res) => {
  res
    .cookie('ckToken', null, {
      maxAge: 0,
      httpOnly: true
    })
    .send();
});

router.get('/validate', async (req, res) => {

  if (!req.user) {
    return res.status(401).send();
  }

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
      _id: user._id,
      email: user.email,
      username: user.username,
      avatar: user.avatar
    });

  } catch (error) {

    return res
      .status(500)
      .send('Internal server error.');

  }

});

router.post('/validate/password', isAuthenticated, async (req, res) => {

  if (!req.body.password) {
    return res
      .status(401)
      .send({
        message: 'Password is invalid.'
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

router.get('/validate/email/:email', async (req, res) => {

  try {

    const user = await User.findUserByEmail(req.params.email);

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

router.get('/validate/username/:username', async (req, res) => {

  try {

    const user = await User.findUserByUsername(req.params.username);

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

router.post('/validate/social', async (req, res) => {

  let profile = null;

  try {

    const { provider, accessToken } = req.body;

    profile = await socialAuthUtils[provider](accessToken);

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

  let dupUser = null;

  try {

    dupUser = await User.findUserByEmail(profile.email);

  } catch (error) {

    return res
      .status(500)
      .send({
        error,
        message: 'Internal server error.'
      });

  }

  if (!dupUser) {

    // redirect to registration form
    return res.send({
      shouldRegister: true,
      profile
    });

  }

  if (
    dupUser.strategy === profile.strategy &&
    dupUser.social.id === profile.social.id
  ) {

    // if it's an existing user, just log in
    const accessToken = await dupUser.generateToken();

    return res
      .cookie('ckToken', accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
      }).send({
        _id: dupUser._id,
        username: dupUser.username,
        avatar: dupUser.avatar
      });

  }

  return res
    .status(403)
    .send({
      message: 'Your email is already registered.'
    });

});

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
        message: 'Incorrect username or password.'
      });

  }

  const { email, password } = req.body;

  try {

    const user = await User.findUserByEmail(email);

    if (user) {

      const {
        _id,
        username,
        avatar,
        strategy
      } = user;

      if (strategy !== 'local') {

        const provider = strategy[0].toUpperCase() + strategy.substr(1, strategy.length - 1);

        return res
          .status(403)
          .send({
            message: `Your email is already registered with ${provider}.`
          });
      }

      const verified = await user.verifyPassword(password);

      if (!verified) {
        return res
          .status(403)
          .send({
            message: 'Incorrect email or password.'
          });
      }

      const accessToken = await user.generateToken();

      return res
        .cookie('ckToken', accessToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7
        }).send({
          _id,
          email,
          username,
          avatar
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

router.post('/signup/local', upload.any(), async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
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
    username,
    avatar
  } = req.body;

  let avatarUrl;

  if (avatar) {

    try {

      avatarUrl = await imgCloudUtils.upload(avatar, username);

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

    const user = await User.registerLocalUser({
      email,
      password,
      username,
      avatar: avatarUrl || null
    });

    const accessToken = await user.generateToken();

    return res
      .cookie('ckToken', accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
      }).send({
        _id: user._id,
        email: user.email,
        username: user.username,
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

router.post('/signup/social', upload.any(), async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
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
    username,
    avatar,
    socialId,
    socialToken
  } = req.body;

  let avatarUrl;

  if (avatar) {

    try {

      avatarUrl = await imgCloudUtils.upload(avatar, username);

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
      username,
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
        username: user.username,
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
    username: Joi.string().required(),
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
        username: modifiedUser.username,
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

module.exports = router;
