const webpackConfig = require('./webpack.base.conf.js')
const merge = require('webpack-merge')
const webpack = require('webpack')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

Object.keys(webpackConfig.entry).forEach(function (name) {
  webpackConfig.entry[name] = ['./build/dev-client'].concat(webpackConfig.entry[name])
})

module.exports = merge(webpackConfig,{
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin()
  ]
})