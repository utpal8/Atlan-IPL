// vue.config.js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
module.exports = {
  configureWebpack: {
    optimization: {
      minimizer: [new UglifyJsPlugin()],
    }
  },
}