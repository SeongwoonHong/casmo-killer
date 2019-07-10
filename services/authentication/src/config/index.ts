import * as dotenv from 'dotenv-safe';
import * as path from 'path';

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv !== 'development' && nodeEnv !== 'test';

dotenv.config({
  allowEmptyValues: true,
  path: path.resolve(
    __dirname,
    !isProd
      ? `../../.env.${process.env.NODE_ENV}`
      : '../../.env',
  ),
});

const config = {
  all: {
    API_ROOT: process.env.API_ROOT || '/api',
    LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
    NODE_ENV: nodeEnv,
    PORT: process.env.PORT || 9000,
  },
  development: {},
  production: {},
  test: {},
};

export default {
  ...config.all,
  ...config[config.all.NODE_ENV],
};
