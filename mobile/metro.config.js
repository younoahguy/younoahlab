// The app's page (assets/web/younoahlab.html) ships as a plain asset: Metro copies its bytes into the app and never runs it as source.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
if (!config.resolver.assetExts.includes('html')) config.resolver.assetExts.push('html');

module.exports = config;
