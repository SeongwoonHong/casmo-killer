const { ExtractJwt, Strategy } = require('passport-jwt');

const keys = require('../../../client/config/keys/key');
const User = require('../../models/user');

module.exports = (passport) => {

  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.jwtSecretKey
  };

  passport.use(new Strategy(opts, (jwtPayload, done) => {

    User.findUserById(jwtPayload, (err, user) => {

      if (err) return done(err, false);

      if (user) return done(null, user);

      return done(null, false);

    });

  }));

};
