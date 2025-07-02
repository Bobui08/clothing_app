const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Thêm alias cho react-native-reanimated
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-reanimated': require.resolve('react-native-reanimated'),
};

// Áp dụng NativeWind vào cấu hình metro
module.exports = withNativeWind(config, {
  input: "./global.css",
});
