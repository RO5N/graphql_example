const webpack = require('webpack');
// Initialize doteenv library
require('dotenv').config();

module.exports = {
  devIndicators: {
    autoPrerender: false,
  },
  webpack: (config) => {
    config.plugins.push(new webpack.EnvironmentPlugin(process.env));
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
