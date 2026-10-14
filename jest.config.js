module.exports = {
  preset: 'react-native',
  // v10 ships icon families as ESM; keep the React Native preset's allowlist
  // and let Babel transform those sources for Jest. mediasfu-shared resolves to
  // its ESM React Native build, which Metro also transforms.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-vector-icons|mediasfu-shared)/)',
  ],
};
