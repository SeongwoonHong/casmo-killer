const express = require('express');
const router = express.Router();
const keys = require('../../client/config/keys/key');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../models/user');

require('../middlewares/strategies/local')(passport);
require('../middlewares/strategies/facebook')(passport);

/* signup using local strategy (email & password) */
router.post('/signup', (req, res) => {

  const { strategy, email, password, username } = req.body;

  const user = new User({ strategy, email, password, username });

  user
    .save()
    .then((doc) => {

      res.status(200).send(doc);

    })
    .catch((err) => {

      res.status(400).send(err);

    });

});

/* signup using facebook social login */
router.get('/signup/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));

router.get('/signup/facebook/return', passport.authenticate('facebook', {
  failureRedirect: '/login'
}), (req, res) => {

  const token = jwt.sign({
    _id: req.user._id
  }, keys.jwtSecretKey, {
    expiresIn: 604800
  });

  console.log(token);

  res.cookie('ckToken', token);
  res.redirect('http://localhost:4000');

});

router.post('/signin/local', (req, res) => {

  const { email, password } = req.body;

  User
    .findByCredentials(email, password)
    .then((user) => {

      const token = jwt.sign({
        _id: user._id
      }, keys.jwtSecretKey, {
        expiresIn: 604800
      });

      res.header('ckToken', token).send(user);

    })
    .catch((err) => {

      res.status(400).send(err);

    });

});

router.get('/username', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send(req.user);
});

module.exports = router;
