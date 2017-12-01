const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const keys = require('../../../client/config/keys/key');
const User = require('../../models/user');

module.exports = (passport) => {

  const opts = {
    clientID: keys.googleClientId,
    clientSecret: keys.googleSecret,
    callbackURL: keys.googleCallbackUrl
  };

  passport.use(new GoogleStrategy(opts, (accessToken, refreshToken, profile, done) => {

    User.findOrCreate(profile, (err, user) => {

      if (err) return done(err, false);

      if (user) return done(null, user);

      return done(null, false);

    });

  }));

};
