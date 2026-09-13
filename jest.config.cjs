module.exports = {
  preset: "jest-expo",
  setupFiles: ["react-native-gesture-handler/jestSetup.js"],
  testMatch: ["**/tests/ui/**/*.test.tsx"],
  setupFilesAfterEnv: ["<rootDir>/tests/ui/setup.ts"],
  clearMocks: true,
};
