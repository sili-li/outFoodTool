const {
  override,
  addPostcssPlugins,
  fixBabelImports,
  overrideDevServer
} = require("customize-cra");

// const _ENV = {
//   DEV: 'http://api.wm.yuejuwenhua.com',
// };
// const devServerConfig = () => config => {
//   return {
//     ...config,
//     proxy: {
//       '/api': {
//         target: _ENV.DEV,
//         changeOrigin: true,
//         secure: false
//       }
//     }
//   };
// };
// 关掉 sourceMap
process.env.GENERATE_SOURCEMAP = process.env.NODE_ENV === 'development' ? 'true' : 'false';
module.exports = {
  webpack: override(
    addPostcssPlugins([
      require("postcss-normalize")({
        "forceImport": true
      }),
      require("postcss-preset-env")({
        "stage": 0
      }),
      require("postcss-px-to-viewport")({
        "viewportWidth": 375,
        "viewportHeight": 667,
        "unitPrecision": 3,
        "viewportUnit": "vw",
        "selectorBlackList": [".ignore", ".hairlines"],
        "minPixelValue": 1,
        "mediaQuery": false
      }),
    ]),
    fixBabelImports('import', {
      libraryName: 'antd-mobile',
      libraryDirectory: 'es',
      style: 'css'
    })
  ),
  // devServer: overrideDevServer(devServerConfig())
};