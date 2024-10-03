/** @type {import("prettier").Config} */
export default {
  htmlWhitespaceSensitivity: 'ignore',
  semi: false,
  singleQuote: true,
  quoteProps: 'consistent',
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
