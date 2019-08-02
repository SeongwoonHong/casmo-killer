import * as dotenv from 'dotenv-safe';
import * as path from 'path';

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv !== 'development' && nodeEnv !== 'test';

dotenv.config({
  allowEmptyValues: true,
  path: path.resolve(
    __dirname,
    !isProd
      ? `../../.env.${nodeEnv}`
      : '../../.env',
  ),
});

const config = {
  all: {
    // api settings
    API_LOG_LEVEL: process.env.API_LOG_LEVEL || 'debug',
    API_PORT: process.env.API_PORT || 9000,
    API_ROOT: process.env.API_ROOT || '/api',
    AUTH_STRATEGIES: process.env.AUTH_STRATEGIES
      ? process.env.AUTH_STRATEGIES.split(',')
      : ['local', 'facebook', 'google'],
    // aws configs
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_REGION: process.env.AWS_REGION || 'us-east-1',
    AWS_S3_ACL: process.env.AWS_S3_ACL || 'public-read',
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || 'damso-pics',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_SES_SENDER_EMAIL: process.env.AWS_SES_SENDER_EMAIL || 'ckboardtoronto@gmail.com',
    // client settings
    CLIENT_APP_NAME: process.env.CLIENT_APP_NAME || 'Damso',
    CLIENT_LOGO_URL: process.env.CLIENT_LOGO_URL || 'https://i.imgur.com/7ClIc5h.png',
    CLIENT_THEME_COLOR: process.env.CLIENT_THEME_COLOR || '#F06292',
    CLIENT_URL: process.env.CLIENT_URL || 'https://localhost:3000',
    // cookies settings
    COOKIE_AUTH_HEADER_NAME: process.env.COOKIE_AUTH_HEADER_NAME || 'x-auth-token',
    COOKIE_AUTH_KEY_NAME: process.env.COOKIE_AUTH_KEY_NAME,
    COOKIE_CSRF_HEADER_NAME: process.env.COOKIE_CSRF_HEADER_NAME || 'x-csrf-token',
    COOKIE_CSRF_KEY_NAME: process.env.COOKIE_CSRF_KEY_NAME,
    COOKIE_OPTIONS: {
      httpOnly: true,
      secure: true,
      signed: true,
    },
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    // db settings
    DB_CLIENT: process.env.DB_CLIENT || 'pg',
    DB_CONNECTION: process.env.DATABASE_URL || {
      database: process.env.DATABASE_NAME,
      host: process.env.DATABASE_HOST || 'localhost',
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT || 5432,
      user: process.env.DATABASE_USER || 'postgres',
    },
    NODE_ENV: nodeEnv,
    // jwt token settings
    RSA_KEY_PAIRS: ((envData = '{}') => {
      try {
        return JSON.parse(envData);
      } catch (error) {
        return {};
      }
    })(process.env.RSA_KEY_PAIRS),
    RSA_KEY_UUID_VERSION: process.env.RSA_KEY_UUID_VERSION || 'uuidv4',
    TOKEN_EXPIRY_FOR_ACCESS: process.env.TOKEN_EXPIRY_FOR_ACCESS || '1d',
    TOKEN_EXPIRY_FOR_REFRESH: process.env.TOKEN_EXPIRY_FOR_REFRESH || '121d',
    TOKEN_ISSUER: process.env.TOKEN_ISSUER || 'damso-authentication-service',
    TOKEN_TARGET_FIELDS: process.env.TOKEN_TARGET_FIELDS
      ? process.env.TOKEN_TARGET_FIELDS.split(',')
      : ['email', 'password'],
  },
  development: {
    // cookies settings
    COOKIE_OPTIONS: {
      httpOnly: true,
      secure: false,
      signed: true,
    },
  },
  production: {},
  test: {
    COOKIE_OPTIONS: {
      httpOnly: true,
      secure: false,
      signed: true,
    },
  },
};

export const configs = {
  ...config.all,
  ...config[config.all.NODE_ENV],
};
