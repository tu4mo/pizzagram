module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: ["plugin:vue/recommended", "@vue/prettier"],

  parserOptions: {
    parser: "@typescript-eslint/parser"
  },

  extends: ["plugin:vue/recommended", "@vue/prettier", "@vue/typescript"]
};
