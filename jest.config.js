module.exports = {
  preset: 'react-native',
  // v10 ships icon families as ESM; keep the React Native preset's allowlist
  // and let Babel transform those sources for Jest.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-vector-icons)/)',
  ],
};
