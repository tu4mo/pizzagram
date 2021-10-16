module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],

  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },

  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
