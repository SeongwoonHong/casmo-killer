const { Strategy } = require('passport-facebook');

const keys = require('../../../client/config/keys/key');
const User = require('../../models/user');

module.exports = (passport) => {

  const opts = {
    clientID: keys.facebookClientId,
    clientSecret: keys.facebookSecret,
    callbackURL: keys.facebookCallbackUrl,
    profileFields: ['displayName', 'email']
  };

  passport.use(new Strategy(opts, (accessToken, refreshToken, profile, done) => {

    User.findOrCreate(profile, (err, user) => {

      if (err) return done(err, false);

      if (user) return done(null, user);

      return done(null, false);

    });

  }));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

};
