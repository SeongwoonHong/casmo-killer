const mongoose = require('mongoose');
/* mongodb connection */
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to mongodb server');
});

db.on('error', console.error);

mongoose.Promise = global.Promise;

mongoose.connect(process.env.REACT_APP_mongooseURI, {
  useMongoClient: true
});