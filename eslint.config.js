import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'

export default typescriptEslint.config(
  {
    ignores: [
      '**/dist',
      '**/functions/lib',
      '**/functions/shell',
      '**/node_modules',
      '**/playwright-report',
    ],
  },
  {
    extends: [
      eslint.configs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      ...typescriptEslint.configs.recommendedTypeChecked,
      ...eslintPluginVue.configs['flat/recommended'],
    ],
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: typescriptEslint.parser,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'import/order': [
        'error',
        {
          'alphabetize': {
            caseInsensitive: true,
            order: 'asc',
            orderImportKind: 'asc',
          },
          'newlines-between': 'always',
        },
      ],
      'sort-keys': 'error',
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
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
      'vue/padding-line-between-blocks': 'error',
    },
  },
  {
    files: ['**/*.js'],
    extends: [typescriptEslint.configs.disableTypeChecked],
  },
  eslintConfigPrettier,
)
