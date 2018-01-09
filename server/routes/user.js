const express = require('express');
const router = express.Router();
const Joi = require('joi');
const multer = require('multer');
const upload = multer();

const imgCloudUtils = require('../utils/imgCloudUtils');
const socialAuthUtils = require('../utils/socialAuthUtils');

const User = require('../db/models/user');

router.get('/validate', async (req, res) => {

  if (!req.user) {
    return res.status(401).send();
  }

  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.cookie('ckToken', null, {
        maxAge: 0,
        httpOnly: true
      }).status(401).send();
    }

    return res.send({
      _id: user._id,
      username: user.username,
      avatar: user.avatar,
      bookmarked: user.bookmarked
    });

  } catch (error) {

    return res
      .status(500)
      .send('Internal server error. Try again in a few minutes.');

  }

});

router.get('/validate/email/:email', async (req, res) => {

  try {

    const user = await User.findUserByEmail(req.params.email);

    res.send({ isDuplicate: !!user });

  } catch (error) {

    return res
      .status(500)
      .send('Internal server error. Try again in a few minutes.');

  }

});

router.get('/validate/username/:username', async (req, res) => {

  try {

    const user = await User.findUserByUsername(req.params.username);

    res.send({ isDuplicate: !!user });

  } catch (error) {

    return res
      .status(500)
      .send('Internal server error. Try again in a few minutes.');

  }

});

router.post('/validate/social/:provider', async (req, res) => {

  let profile = null;

  try {

    profile = await socialAuthUtils[req.params.provider](req.body.accessToken);

  } catch (error) {

    return res
      .status(500)
      .send('Failed to retrieve your social profile. Try again in a few minutes.');

  }

  if (!profile) {

    return res
      .status(500)
      .send('Failed to retrieve your social profile. Try again in a few minutes.');

  }

  let dupUser = null;

  try {

    dupUser = await User.findUserByEmail(profile.email);

  } catch (error) {

    return res
      .status(500)
      .send('Internal server error. Try again in a few minutes.');

  }

  if (!dupUser) {

    // redirect to registration form
    return res.send({
      shouldRegister: true,
      profile
    });

  }

  if (dupUser.strategy === profile.strategy && dupUser.social.id === profile.social.id) {

    // if it's an existing user, just log in
    const accessToken = await dupUser.generateToken();
    return res.cookie('ckToken', accessToken, {
      httpOnly: true,
      maxAge: 604800
    }).send({
      _id: dupUser._id,
      username: dupUser.username,
      avatar: dupUser.avatar,
      bookmarked: dupUser.bookmarked
    });

  }

  return res
    .status(403)
    .send('Your email is already registered.');

});

router.post('/signin/local', async (req, res) => {

  const result = Joi.validate(req.body, Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9~!@#$%^&*()_+,.\]\]\\[/\\]{6,30}$/).min(6).max(30).required()
  }));

  if (result.error) {

    return res.status(400).send('Incorrect username or password.');

  }

  const { email, password } = req.body;

  try {

    const user = await User.findUserByEmail(email);

    if (user) {

      const {
        _id,
        username,
        avatar,
        strategy,
        bookmarked
      } = user;

      if (strategy !== 'local') {

        const provider = strategy[0].toUpperCase() + strategy.substr(1, strategy.length - 1);

        return res
          .status(403)
          .send(`Your email is already registered with ${provider}.`);
      }

      const verified = await user.verifyPassword(password);

      if (!verified) {
        return res
          .status(403)
          .send('Incorrect email or password.');
      }

      const accessToken = await user.generateToken();

      return res.cookie('ckToken', accessToken, {
        httpOnly: true,
        maxAge: 604800
      }).send({
        _id,
        username,
        avatar,
        bookmarked
      });

    }

    return res
      .status(403)
      .send('No account exists with this email address.');

  } catch (error) {

    return res
      .status(500)
      .send('Internal server error. Try again in a few minutes.');

  }

});

router.post('/signup/local', upload.any(), async (req, res) => {

  const result = Joi.validate(req.body, Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9~!@#$%^&*()_+,.\]\]\\[/\\]{6,30}$/).min(6).max(30).required(),
    username: Joi.string().regex(/^[a-zA-Z0-9]{4,20}/).min(4).max(20).required(),
    avatar: Joi.string().allow('')
  }));

  if (result.error) {

    console.log(result);
    return res.status(400).send('Incorrect user information provided.');

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
        .send('Failed to upload the profile photo. Try again in a few minutes.');

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

    return res.cookie('ckToken', accessToken, {
      httpOnly: true,
      maxAge: 604800
    }).send({
      _id: user._id,
      username: user.username,
      avatar: user.avatar,
      bookmarked: user.bookmarked
    });

  } catch (error) {

    return res
      .status(500)
      .send('Internal server error. Try again in a few minutes.');

  }

});

router.post('/signup/social', upload.any(), async (req, res) => {

  const result = Joi.validate(req.body, Joi.object({
    strategy: Joi.string().valid(['facebook', 'google', 'kakao']),
    email: Joi.string().email().required(),
    username: Joi.string().regex(/^[a-zA-Z0-9]{4,20}/).min(4).max(20).required(),
    avatar: Joi.string().allow(''),
    social: Joi.object({
      id: Joi.string().required(),
      accessToken: Joi.string().required()
    })
  }));

  if (result.error) {

    console.log(req.body);
    console.log(result);
    return res.status(400).send('Incorrect user information provided.');

  }

  try {

    const user = await User.registerSocialUser(req.body);

    const accessToken = await user.generateToken();

    return res.cookie('ckToken', accessToken, {
      httpOnly: true,
      maxAge: 604800
    }).send({
      _id: user._id,
      username: user.username,
      avatar: user.avatar,
      bookmarked: user.bookmarked
    });

  } catch (error) {

    return res
      .status(500)
      .send('Internal server error. Try again in a few minutes.');

  }

});

module.exports = router;
