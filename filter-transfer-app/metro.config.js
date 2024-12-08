const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const customConfig = {
  resolver: {
    sourceExts: ["jsx", "js", "ts", "tsx", "cjs", "json"],
    assetExts: ['tflite', ...defaultConfig.resolver.assetExts],
  },
  transformer: {
    unstable_allowRequireContext: true,
  },
};

// Manually merge the configurations
const finalConfig = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    ...customConfig.resolver,
  },
  transformer: {
    ...defaultConfig.transformer,
    ...customConfig.transformer,
  },
};

module.exports = finalConfig;