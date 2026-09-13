import tseslint from "typescript-eslint";
export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      "ios/**",
      "android/**",
      "outputs/**",
      ".expo/**",
      ".claude/**",
    ],
  },
  ...tseslint.configs.recommended,
  { rules: { "@typescript-eslint/no-require-imports": "off" } },
);
