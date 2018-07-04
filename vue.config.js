module.exports = {
  chainWebpack: config => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.use("raw-loader").loader("raw-loader");
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/variables.scss";`
      }
    }
  },
  lintOnSave: false
};
