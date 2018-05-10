const jwtUtils = require('../utils/jwtUtils');

const jwtMiddleware = async (req, res, next) => {

  const { ckToken: token } = req.signedCookies;

  if (!token) {
    req.user = null;
    return next();
  }

  try {

    const { user, iat } = await jwtUtils.verify(token);

    if (!user) {
      req.user = null;
    } else {

      // if the token is more than three days old,
      // refresh the token for another seven days
      if ((Date.now() / 1000) - iat > 60 * 60 * 24 * 3) {

        const freshToken = await jwtUtils.sign({ user }, 'user');

        res.cookie('ckToken', freshToken, {
          httpOnly: true,
          signed: true,
          maxAge: 1000 * 60 * 60 * 24 * 7
        });

      }

      req.user = user;
    }

  } catch (error) {

    console.log(error);
    req.user = null;

  }

  next();

};

module.exports = jwtMiddleware;
