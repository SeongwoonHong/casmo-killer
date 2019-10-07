const express = require('express');
const next = require('next');
const proxyMiddleware = require('http-proxy-middleware');
const { createServer } = require('http');
const { parse } = require('url');

const port = parseInt(`${process.env.PORT}`, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const proxies = require('./proxy');

app
  .prepare()
  .then(() => {
    const server = express();

    Object.keys(proxies).forEach((context) => {
      server.use(proxyMiddleware(context, proxies[context]));
    });

    server.all('*', (req, res) => {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      if (pathname.length > 1 && pathname.slice(-1) === '/') {
        app.render(req, res, pathname.slice(0, -1), query);
      } else {
        handle(req, res, parsedUrl);
      }
    });

    server.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`.... Running on http://localhost:${port}..`);
    });
  });

module.exports = app;
