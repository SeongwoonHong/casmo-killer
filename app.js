const path = require('path');
const express = require('express');

const app = express();

const port = process.env.PORT || 4000;

const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const openBrowser = require('react-dev-utils/openBrowser');

const isDev = process.env.NODE_ENV === 'development';

const publicPath = `client/${isDev ? 'public' : 'build'}`;
const indexFile = `index${isDev ? '.dev' : ''}.html`;

if (isDev) {
  const devServer = require('./client/config/scripts/dev')(port);

  app.use(webpackMiddleware(devServer.compiler, devServer.serverConfig));
  app.use(webpackHotMiddleware(devServer.compiler));
}

app.use(express.static(path.join(__dirname, publicPath)));

app.use('/api', require('./server/api'));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, publicPath, indexFile));
});

app.listen(port, () => {
  if (isDev) {
    openBrowser(`http://localhost:${port}/`);
  }
});
