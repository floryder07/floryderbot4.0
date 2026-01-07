module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module"
  },
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  rules: {
    // Project preferences
    "prettier/prettier": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-console": "warn"
  },
  overrides: [
    {
      files: ["**/*.ts"],
      rules: {}
    },
    {
      files: ["src/tests/**", "**/*.test.ts"],
      env: {
        jest: true
      },
      rules: {
        "no-unused-expressions": "off"
      }
    }
  ]
};
