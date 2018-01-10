const isAuthenticated = (req, res, next) => {

  if (!req.user) {
    return res.status(401).send({
      message: 'Unauthorized Access'
    });
  }

  next();

};

module.exports = isAuthenticated;
