const withSass = require('@zeit/next-sass');
const path = require('path')
const nextRuntimeDotenv = require('next-runtime-dotenv');

const withConfig = nextRuntimeDotenv({
	public: ['API_URL'],
});

module.exports = withConfig(withSass({
  webpack(config, options) {
    config.resolve.alias['components'] = path.join(__dirname, 'components');
    config.resolve.alias['models'] = path.join(__dirname, 'models');
    config.resolve.alias['repositories'] = path.join(__dirname, 'repositories');
    config.resolve.alias['stores'] = path.join(__dirname, 'stores');
    config.resolve.alias['styles'] = path.join(__dirname, 'styles');
    config.resolve.alias['interfaces'] = path.join(__dirname, 'interfaces');
    
    return config;
  },
  cssModules: false,
  sassLoaderOptions: {},
}));
