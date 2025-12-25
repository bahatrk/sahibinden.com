// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 'wasm' uzantısını Metro'nun tanıdığı dosya türlerine ekliyoruz
config.resolver.sourceExts.push('wasm');
config.resolver.assetExts.push('wasm');

module.exports = config;