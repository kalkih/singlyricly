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
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/sw.js',
      swDest: 'service-worker.js',
    },
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg')
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
