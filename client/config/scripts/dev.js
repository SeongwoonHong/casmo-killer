'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    throw err;
});

// Ensure environment variables are read.
require('../utils/env');

const fs = require('fs');
const chalk = require('chalk');
const webpack = require('webpack');

const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const { createCompiler, prepareUrls } = require('react-dev-utils/WebpackDevServerUtils');

const paths = require('../utils/paths');

const config = require('../webpack.config.dev');
const createDevServerConfig = require('../webpack.config.server');

const useYarn = fs.existsSync(paths.yarnLockFile);

if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
    process.exit(1);
}

const prepDevServer = (localPort) => {

    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const HOST = process.env.HOST || '0.0.0.0';
    const appName = require(paths.appPackageJson).name;
    const urls = prepareUrls(protocol, HOST, localPort);

    console.log(chalk.cyan('Starting the development server...\n'));

    return {
        compiler: createCompiler(webpack, config, appName, urls, useYarn),
        serverConfig: createDevServerConfig(
            urls.lanUrlForConfig,
            protocol,
            HOST
        )
    };

};

module.exports = prepDevServer;
