/** @type {import("prettier").Config} */
module.exports = {
  htmlWhitespaceSensitivity: 'ignore',
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
