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

  if (!token) {
    req.user = null;
    return next();
  }

  try {

    const user = await jwtUtils.verify(token);

    if ((Date.now() / 1000) - user.iat > 60 * 60 * 24 * 3) {

      const freshToken = await jwtUtils.sign({
        _id: user._id,
        username: user.username,
        avatar: user.avatar
      }, 'user');

      return res.cookie('ckToken', freshToken, {
        httpOnly: true,
        maxAge: 604800
      });

    }

    req.user = user;

  } catch (error) {

    console.log(error);
    req.user = null;

  }

  next();

};

module.exports = jwtMiddleware;
