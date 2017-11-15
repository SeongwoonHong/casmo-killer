// key.js figure out what set of credintial to return
if (process.env.NODE_ENV === 'production') {
  // in production - return the prod set of keys
  module.exports = require('./prod');
} else {
  // in development - return the dev keys
  module.exports = require('./dev');
}
