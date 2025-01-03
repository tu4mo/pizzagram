/** @type {import("prettier").Config} */
export default {
  htmlWhitespaceSensitivity: 'ignore',
  quoteProps: 'consistent',
  semi: false,
  singleQuote: true,
  vueIndentScriptAndStyle: true,

  // eslint-disable-next-line sort-keys
  overrides: [
    {
      files: ['index.html'],
      options: {
        printWidth: 200,
      },
    },
  ],
}
