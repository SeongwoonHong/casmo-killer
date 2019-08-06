import * as dotenv from 'dotenv-safe';
import * as path from 'path';

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv !== 'development' && nodeEnv !== 'test';

dotenv.config({
  allowEmptyValues: true,
  path: path.resolve(
    __dirname,
    !isProd ? `../../.env.${process.env.NODE_ENV}` : '../../.env',
  ),
});

const config = {
  all: {
    API_ROOT: process.env.API_ROOT || '/api',
    DB_CLIENT: process.env.DB_CLIENT || 'pg',
    DB_CONNECTION: process.env.DATABASE_URL || {
      database: process.env.DATABASE_NAME,
      host: process.env.DATABASE_HOST || 'localhost',
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT || 5432,
      user: process.env.DATABASE_USER || 'postgres',
    },
    LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
    NODE_ENV: nodeEnv,
    PORT: process.env.PORT || 9000,
  },
  development: {},
  production: {},
  test: {},
};

export const configs = {
  ...config.all,
  ...config[config.all.NODE_ENV],
};
