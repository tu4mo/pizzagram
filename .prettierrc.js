/** @type {import("prettier").Config} */
export default {
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
