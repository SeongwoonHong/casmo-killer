// prod.js production keys here!!
module.exports = {
  mongooseURI: process.env.MONGOOSE_MEMO_URI,
  sessionSecret: process.env.SESSION_SECRET
};
