const jwt = require('jsonwebtoken');

const {
  jwtSecretKey: jwtSecret,
  jwtIssuer: issuer,
  jwtAlgorithm: algorithm
} = process.env;

const jwtUtils = {

  sign: (payload, subject, expiresIn = '7d') => {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, jwtSecret, {
        algorithm,
        issuer,
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
      jwt.verify(token, jwtSecret, { algorithm }, (error, decoded) => {
        if (error) {
          reject(error);
        }
        resolve(decoded);
      });
    });
  }

};

module.exports = jwtUtils;
