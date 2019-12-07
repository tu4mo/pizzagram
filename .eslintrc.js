module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    "plugin:vue/recommended",
    "eslint:recommended",
    "@vue/typescript",
    "prettier",
    "prettier/vue",
    "prettier/@typescript-eslint"
  ],

  parserOptions: {
    parser: "@typescript-eslint/parser"
  }
};
