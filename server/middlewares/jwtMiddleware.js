const jwtUtils = require('../utils/jwtUtils');

const extractCookie = (cookies = '') => {

  const obj = {};

  for (let cookie of cookies.split(/; */)) {

    const eqSign = cookie.indexOf('=');

    if (eqSign > 0) {

      const key = cookie.substr(0, eqSign).trim();
      const val = cookie.substr(eqSign + 1, cookie.length).trim().replace(/^"/g, '');

      if (obj[key] === undefined) {
        obj[key] = decodeURIComponent(val);
      }
    }

  }

  return obj;

};

const jwtMiddleware = async (req, res, next) => {

  const token = extractCookie(req.headers.cookie).ckToken;

  if (token) {

    const user = await jwtUtils.verify(extractCookie(req.headers.cookie).ckToken);
    req.user = user;

  }

  next();

};

module.exports = jwtMiddleware;
