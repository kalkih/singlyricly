module.exports = {
  publicPath: process.env.BASE_URL,
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/styles/global.scss";
        `,
      },
    },
  },
  pwa: {
    themeColor: '#085078',
    msTileColor: '#085078',
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg')
    const compile = config.module.rule('compile')

    compile
      .test(/\.worker\.js$/)
      .use('worker-loader')
      .loader('worker-loader')
    svgRule.uses.clear()
    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .options({
        svgo: {
          plugins: [
            { collapseGroups: false },
            { moveGroupAttrsToElems: false },
            { moveElemsAttrsToGroup: false },
            { removeUselessStrokeAndFill: false },
            { removeUnknownsAndDefaults: false },
            { cleanupIDs: false },
          ],
        },
      })
  },
}
