/** @type {import("prettier").Config} */
export default {
  htmlWhitespaceSensitivity: 'ignore',
  quoteProps: 'consistent',
  semi: false,
  singleQuote: true,
  vueIndentScriptAndStyle: true,

  overrides: [
    {
      files: ['index.html'],
      options: {
        printWidth: 200,
      },
    },
  ],
}
