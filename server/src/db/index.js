/* mongodb connection */
const mongoose = require('mongoose');
const db = mongoose.connection;

db.once('open', () => {
  console.log('Successfully connected to the database.');
});

db.on('error', console.error);

mongoose.Promise = global.Promise;

mongoose.connect(process.env.mongooseURI);
