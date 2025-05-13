// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add resolver for Node.js core modules
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    // Remove stream and other Node.js core modules
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    zlib: require.resolve('browserify-zlib'),
    util: require.resolve('util'),
    buffer: require.resolve('buffer'),
    events: require.resolve('events'),
  },
  // Make sure polyfills are resolved correctly no matter who requires them
  sourceExts: [...config.resolver.sourceExts, 'cjs'],
};

module.exports = config;
