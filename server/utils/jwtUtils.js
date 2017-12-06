const jwt = require('jsonwebtoken');
const { REACT_APP_jwtSecretKey: jwtSecret } = process.env;

const jwtUtils = {

  sign: (payload, subject) => {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, jwtSecret, {
        issuer: 'ckboard.com',
        expiresIn: 604800,
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
