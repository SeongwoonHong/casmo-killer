import getConfig from 'next/config'

const {
  serverRuntimeConfig = {},
  publicRuntimeConfig = {},
} = getConfig() || {};

export const configs = {
  api: {
    endpoints: {
      auth: publicRuntimeConfig.API_ENDPOINT_AUTH || '/auth',
    },
    host: publicRuntimeConfig.API_HOST || '',
  },
  apiKeys: {
    facebook: publicRuntimeConfig.FACEBOOK_CLIENT_ID || '',
    google: publicRuntimeConfig.GOOGLE_CLIENT_ID || '',
    kakao: publicRuntimeConfig.KAKAO_CLIENT_ID || '',
  },
  headerKeys: {
    auth: publicRuntimeConfig.AUTH_HEADER_KEY || 'x-auth-token',
    csrf: publicRuntimeConfig.CSRF_HEADER_KEY || 'x-csrf-token',
  },
  storageKeys: {},
};
