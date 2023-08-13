/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: [
    "custom/base",
    "custom/react",
    "custom/nextjs",
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
};

module.exports = config;