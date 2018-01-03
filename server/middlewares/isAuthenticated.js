const isAuthenticated = (req, res, next) => {

  if (!req.user) {
    return res.status(401).send('Unauthorized Access');
  }

  next();

};

module.exports = isAuthenticated;
