import { configs } from './src/config';

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
