// tslint:disable-next-line:no-submodule-imports no-var-requires
require('ts-node/register');
// Update with your config settings.

import { configs } from './src/config';

const baseConfig = (env = process.env.NODE_ENV) => ({
  client: process.env.DB_CLIENT || 'pg',
  connection: configs.DB_CONNECTION,
  debug: true,
  migrations: {
    directory: `${__dirname}/src/database/migrations`,
  },
  seeds: {
    directory: `${__dirname}/src/database/seeds/${env}`,
  },
});

module.exports = {
  development: {
    ...baseConfig('development'),
  },
  test: {
    ...baseConfig('test'),
  },
};
