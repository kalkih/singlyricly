const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
const path = require('path')

module.exports = {
  publicPath: process.env.BASE_URL,
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'),
      },
    },
  },
  pwa: {
    themeColor: '#000000',
    msTileColor: '#4a00e0',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/sw.js',
      swDest: 'service-worker.js',
    },
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg')
    const compile = config.module.rule('compile')

    if (process.env.NODE_ENV === 'production') {
      config
        .plugin('prerender-spa-plugin')
        .use(PrerenderSPAPlugin, [
          {
            staticDir: path.join(__dirname, 'dist'),
            indexPath: path.join(__dirname, 'dist/index.html'),
            routes: ['/'],
            renderer: new Renderer({
              headless: false,
              renderAfterTime: 1000,
            }),
          },
        ])
    }

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
