const path = require('path');

const express = require('express');
const app = express();

const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const devUtils = require('./client/scripts/start');

if (process.env.NODE_ENV === 'development') {
    app.use(webpackMiddleware(devUtils.compiler, devUtils.serverConfig));
    app.use(webpackHotMiddleware(devUtils.compiler));
}

app.get('/', (req, res) => {
    res.sendFile(path.resolve('./public/index.html'));
});

app.listen(4000, () => {
    console.log('Express is running.');
});
