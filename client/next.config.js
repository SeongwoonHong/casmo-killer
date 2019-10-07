const fs = require('fs');
const nextRuntimeDotenv = require('next-runtime-dotenv');
const path = require('path');
const withSass = require('@zeit/next-sass');

const tsConfig = require('./tsconfig.json');
const envKeys = (() => {
  try {
    const rawEnvs = fs.readFileSync('./.env', 'utf8') || [];

    return rawEnvs
      .split('\n')
      .filter((line) => Boolean(line))
      .map((line) => {
        return line.split('=')[0];
      });
  } catch (err) {
    return [];
  }
})();

const withConfig = nextRuntimeDotenv({
  public: envKeys,
  server: envKeys,
});

module.exports = withConfig(withSass({
  webpack(config, options) {
    if (
      tsConfig &&
      tsConfig.compilerOptions &&
      tsConfig.compilerOptions.paths
    ) {
      const aliases = tsConfig.compilerOptions.paths;

      Object.keys(aliases).forEach((alias) => {
        config.resolve.alias[alias] = path.join(__dirname, aliases[alias][0]);
      });
    }

    config.module.rules.forEach((rule) => {
      if (String(rule.test) === String(/\.sass$/)) {
        rule.use.push({
          loader: 'sass-resources-loader',
          options: {
            resources: [
              './src/styles/global/_mixin.scss',
              './src/styles/global/_variables.scss',
            ],
          },
        });
      }
    });

    return config;
  },
  cssModules: false,
  sassLoaderOptions: {},
}));
