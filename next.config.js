module.exports = {
  webpack: (config, options) => {
    config.resolve.extensions = ['.ts', '.tsx', '.js']
    
    config.module.rules.push({
      test: /\.(png|jpg|gif|json)$/i,
      loader: "url-loader?limit=100000",
    });

    return config;
  },
};
