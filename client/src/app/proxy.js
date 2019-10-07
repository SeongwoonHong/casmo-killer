module.exports = {
  '/auth': {
    target: 'https://damso-auth-service.herokuapp.com/api',
    pathRewrite: {
      '^/auth': '',
    },
    changeOrigin: true,
  },
};
