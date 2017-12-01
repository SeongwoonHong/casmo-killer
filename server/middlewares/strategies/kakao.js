const { Strategy } = require('passport-kakao');

const keys = require('../../../client/config/keys/key');
const User = require('../../models/user');

module.exports = (passport) => {

  const opts = {
    clientID: keys.kakaoClientId,
    clientSecret: keys.kakaoSecret,
    callbackURL: keys.kakaoCallbackUrl
  };

  passport.use(new Strategy(opts, (accessToken, refreshToken, profile, done) => {

    User.findOrCreate(profile, (err, user) => {

      if (err) return done(err, false);

      if (user) return done(null, user);

      return done(null, false);

    });

  }));

};
