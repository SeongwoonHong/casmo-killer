const env = process.env.NODE_ENV || 'development';

const CONSTANTS = {
  all: {
    AUTH_STRATEGIES: [
      'local',
      'facebook',
      'google',
      'kakao',
    ],
    COOKIE_OPTIONS: {
      httpOnly: true,
      secure: true,
      signed: true,
    },
    HEADER_NAME_FOR_ACCESS_TOKEN: 'x-auth-token',
    HEADER_NAME_FOR_CSRF_TOKEN: 'x-csrf-token',
    JOB_NAME_FOR_EMAIL_UPDATE: 'email-update',
    JOB_NAME_FOR_PWD_UPDATE: 'pwd-update',
    JOB_NAME_FOR_REGISTRATION: 'user-registration',
    SOCIAL_AUTH_PROVIDERS: [
      'facebook',
      'google',
      'kakao',
    ],
    TOKEN_ISSUER: 'damso-authentication-service',
  },
  development: {
    COOKIE_OPTIONS: {
      httpOnly: true,
      secure: false,
      signed: true,
    },
  },
  test: {
    COOKIE_OPTIONS: {
      httpOnly: true,
      secure: false,
      signed: true,
    },
  },
};

export const constants = {
  ...CONSTANTS.all,
  ...(CONSTANTS[env] || {}),
};
