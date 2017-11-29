const express = require('express');
const router = express.Router();
const keys = require('../../client/config/keys/key');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../models/user');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

require('../middlewares/strategies/local')(passport);
require('../middlewares/strategies/facebook')(passport);
require('../middlewares/strategies/google')(passport);
require('../middlewares/strategies/kakao')(passport);

const jwtUtils = require('../utils/jwt');

/* signup using local strategy (email & password) */
router.post('/signup', (req, res) => {

  const { strategy, email, password, username } = req.body;

  const user = new User({
    strategy, email, password, username
  });

  user
    .save()
    .then((doc) => {

      res.status(200).send(doc);

    })
    .catch((err) => {

      res.status(400).send(err);

    });

});

router.post('/signin/local', (req, res) => {

  const { email, password } = req.body;

  User
    .findByCredentials(email, password)
    .then((user) => {

      const token = jwtUtils.sign(user);

      res.status(200).send({ token });

    })
    .catch((error) => {

      res.status(400).send({ error });

    });

});

/* signup using facebook social login */
router.get('/signup/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));

router.get('/signup/facebook/return', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {

  const token = jwtUtils.sign(req.user);

  res.cookie('ck-token', token);
  res.redirect('http://localhost:4000');

});

/* signup using google social login */
router.get('/signup/google', passport.authenticate('google', {
  scope: ['email']
}));

router.get('/signup/google/return', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {

  const token = jwtUtils.sign(req.user);

  res.cookie('ck-token', token);
  res.redirect('http://localhost:4000');

});

/* signup using kakao social login */
router.get('/signup/kakao', passport.authenticate('kakao'));

router.get('/signup/kakao/return', passport.authenticate('kakao', { failureRedirect: '/login' }), (req, res) => {

  const token = jwtUtils.sign(req.user);

  res.cookie('ck-token', token);
  res.redirect('http://localhost:4000');

});

router.get('/username', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send(req.user);
});

module.exports = router;
