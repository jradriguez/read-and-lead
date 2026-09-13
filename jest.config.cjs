module.exports = {
  preset: "jest-expo",
  // Nested checkouts have their own tests and React/module resolution.
  roots: ["<rootDir>/tests/ui"],
  setupFiles: ["react-native-gesture-handler/jestSetup.js"],
  testMatch: ["**/tests/ui/**/*.test.tsx"],
  setupFilesAfterEnv: ["<rootDir>/tests/ui/setup.ts"],
  clearMocks: true,
};
