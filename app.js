const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const api = require('./server/routes');
const keys = require('./client/config/keys/key');

const app = express();

const port = process.env.PORT || 4000;

const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const openBrowser = require('react-dev-utils/openBrowser');

const isDev = process.env.NODE_ENV === 'development';

const publicPath = `client/${isDev ? 'public' : 'build'}`;
const indexFile = `index${isDev ? '.dev' : ''}.html`;

/* mongodb connection */
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => { console.log('Connected to mongodb server'); });
mongoose.connect(keys.mongooseURI, {
  useMongoClient: true,
});

if (isDev) {
  const devServer = require('./client/config/scripts/dev')(port);

  app.use(webpackMiddleware(devServer.compiler, devServer.serverConfig));
  app.use(webpackHotMiddleware(devServer.compiler));
}

app.use(require('morgan')('dev'));

app.use(require('body-parser').json());

app.use(express.static(path.join(__dirname, publicPath)));

app.use('/api', api);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, publicPath, indexFile));
});

app.listen(port, () => {
  if (isDev) {
    openBrowser(`http://localhost:${port}/`);
  }
});
