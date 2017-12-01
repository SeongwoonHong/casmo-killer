const jwt = require('jsonwebtoken');
const keys = require('../../client/config/keys/key');

const jwtUtils = {

  sign: (user) => {
    return jwt.sign({
      _id: user._id,
      email: user.email,
      username: user.username,
      avatar: user.avatar
    }, keys.jwtSecretKey, {
      expiresIn: 604800
    });
  }

};

module.exports = jwtUtils;
