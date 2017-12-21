const jwtUtils = require('../utils/jwtUtils');
const extractCookie = require('../utils/extractCookie');

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
        user: {
          strategy: user.strategy,
          _id: user._id,
          email: user.email,
          username: user.username,
          avatar: user.avatar
        }
      }, 'user');

      res.cookie('ckToken', freshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
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
