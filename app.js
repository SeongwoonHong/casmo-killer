const path = require('path');

const express = require('express');
const app = express();

const port = process.env.PORT || 4000;

const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const openBrowser = require('react-dev-utils/openBrowser');

if (process.env.NODE_ENV === 'development') {

    const devServer = require('./client/config/scripts/dev')(port);

    app.use(webpackMiddleware(devServer.compiler, devServer.serverConfig));
    app.use(webpackHotMiddleware(devServer.compiler, {
        reload: true
    }));

}

app.use('/api', require('./server/api'));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
});

app.listen(port, () => {

    if (process.env.NODE_ENV === 'development') {

        openBrowser(`http://localhost:${port}/`);

    }

});
