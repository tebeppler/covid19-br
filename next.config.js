module.exports = {
  webpack: (config, options) => {
    config.resolve.extensions = ['.ts', '.tsx', '.js']

    return config;
  },
};
