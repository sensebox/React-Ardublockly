/* config-overrides.js */

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  return {
    ...config,
    resolve: {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        vm: require.resolve("vm-browserify"),
      },
    },
  };
};
