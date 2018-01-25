const jwt = require('jsonwebtoken');

const {
  jwtSecretKey: jwtSecret
} = process.env;

const jwtUtils = {

  sign: (payload, subject, expiresIn = '7d') => {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, jwtSecret, {
        issuer: 'ckboard.com',
        expiresIn,
        subject
      }, (error, token) => {
        if (error) {
          reject(error);
        }
        resolve(token);
      });
    });
  },

  verify: (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, (error, decoded) => {
        if (error) {
          reject(error);
        }
        resolve(decoded);
      });
    });
  }

};

module.exports = jwtUtils;
