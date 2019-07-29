// tslint:disable-next-line:no-submodule-imports no-var-requires
require('ts-node/register');
// Update with your config settings.

import { configs } from '~config';

module.exports = {
  client: process.env.DB_CLIENT || 'pg',
  connection: configs.DB_CONNECTION,
  debug: true,
  migrations: {
    directory: `${__dirname}/src/database/migrations`,
  },
  seeds: {
    directory: `${__dirname}/src/database/seeds`,
  },
};
