module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/strict',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],

  parser: 'vue-eslint-parser',
  parserOptions: {
    extraFileExtensions: ['.vue'],
    parser: '@typescript-eslint/parser',
    project: true,
  },

  reportUnusedDisableDirectives: true,

  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/prefer-optional-chain': 'error',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          orderImportKind: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'vue/component-name-in-template-casing': 'error',
    'vue/define-emits-declaration': 'error',
    'vue/define-macros-order': 'error',
    'vue/define-props-declaration': 'error',
    'vue/multi-word-component-names': 'off',
    'vue/no-required-prop-with-default': 'error',
    'vue/no-undef-components': [
      'error',
      { ignorePatterns: ['RouterLink', 'RouterView'] },
    ],
  },

  settings: {
    'import/resolver': {
      typescript: true,
    },
  },

  overrides: [
    {
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      files: ['*.js', '*.cjs'],
    },
  ],
}
