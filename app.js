const path = require('path');

// loading local environment variables
require('dotenv').config({
  path: path.resolve(`./client/config/env/.env.${process.env.NODE_ENV}`)
});

const express = require('express');
const app = express();

const port = process.env.PORT || 4000;

const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const morgan = require('morgan');
const jwtMiddleware = require('./server/middlewares/jwtMiddleware');

const openBrowser = require('react-dev-utils/openBrowser');

const isDev = process.env.NODE_ENV === 'development';

const publicPath = `client/${isDev ? 'public' : 'build'}`;
const indexFile = `index${isDev ? '.dev' : ''}.html`;

const api = require('./server/routes');

// db connection
require('./server/db/index');

// webpack middlewares for development
if (isDev) {
  const devServer = require('./client/config/scripts/dev')(port);
  app.use(webpackMiddleware(devServer.compiler, devServer.serverConfig));
  app.use(webpackHotMiddleware(devServer.compiler));
}

// default middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(jwtMiddleware);
app.use(express.static(path.join(__dirname, publicPath)));

// api endpoints
app.use('/api', api);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, publicPath, indexFile));
});

app.listen(port, () => {
  if (isDev) {
    // openBrowser(`http://localhost:${port}/`);
  }
});
