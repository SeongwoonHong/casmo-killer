import * as http from 'http';

import App from './app';
import configs from './config';
import logger from './lib/logger';

import { AddressInfo } from 'net';

logger.info(
  `CONFIGS ${JSON.stringify(
    configs,
    null,
    2,
  )}`,
);

const port: number | boolean = normalizePort(configs.PORT);

App.set('port', port);

const server: http.Server = http.createServer(App);

server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val): number | boolean {
  const _port = parseInt(val, 10);

  if (isNaN(_port)) {
    return val;
  }

  if (_port >= 0) {
    return _port;
  }

  return false;
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port as string === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      throw new Error(`${bind} requires elevated privileges`);
    case 'EADDRINUSE':
      throw new Error(`${bind} is already in use`);
    default:
      throw error;
  }
}

function onListening(): void {
  const addr: AddressInfo | string = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;

  logger.debug(`Listening on ${bind}`);
}

export default server;
