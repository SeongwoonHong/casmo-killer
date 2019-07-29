const devProxy = {
  '/api': {
    target: 'https://damsoisawesome',
    // pathRewrite: { '^/api': '' },
    changeOrigin: true,
  },
};

export {
  devProxy
};
