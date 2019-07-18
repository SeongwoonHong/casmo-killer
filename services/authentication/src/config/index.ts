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
    AUTH_STRATEGIES: process.env.AUTH_STRATEGIES
      ? process.env.AUTH_STRATEGIES.split(',')
      : ['local', 'facebook', 'google'],
    // aws configs
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_ACL: process.env.AWS_ACL || 'public-read',
    AWS_BUCKET: process.env.AWS_BUCKET || 'damso-pics',
    AWS_REGION: process.env.AWS_REGION || 'us-east-1',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_SIGNATURE_VERSION: process.env.AWS_SIGNATURE_VERSION,
    // cookies settings
    COOKIE: {
      IS_SECURE: true,
      KEY_NAME: process.env.COOKIE_KEY_NAME,
      SECRET: process.env.COOKIE_SECRET,
    },
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
    RSA_KEY_PAIRS: ((envData = '{}') => {
      try {
        return JSON.parse(envData);
      } catch (error) {
        return {};
      }
    })(process.env.RSA_KEY_PAIRS),
    TOKEN: {
      EXPIRY_FOR_ACCESS_TOKEN: process.env.EXPIRY_FOR_ACCESS_TOKEN || '1d',
      EXPIRY_FOR_REFRESH_TOKEN: process.env.EXPIRY_FOR_REFRESH_TOKEN || '121d',
      ISSUER: process.env.TOKEN_ISSUER || 'asdf',
      TARGET_FIELDS: process.env.TOKEN_FIELDS
        ? process.env.TOKEN_FIELDS.split(',')
        : ['email', 'password'],
    },
  },
  development: {
    COOKIE: {
      IS_SECURE: false,
      KEY_NAME: process.env.COOKIE_KEY_NAME,
      SECRET: process.env.COOKIE_SECRET,
    },
  },
  production: {},
  test: {},
};

export const configs = {
  ...config.all,
  ...config[config.all.NODE_ENV],
};
