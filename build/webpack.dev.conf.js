const webpackConfig = require('./webpack.base.conf.js')
const merge = require('webpack-merge')
const webpack = require('webpack')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const entriesConfig = require('../config')

Object.keys(webpackConfig.entry).forEach(function (name) {
  webpackConfig.entry[name] = ['./build/dev-client'].concat(webpackConfig.entry[name])
})

let webpackProdConfig = {
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin()
  ]
}

entriesConfig.forEach(item => {
  const option = {
    filename: item.filename,
    template: item.template,
    chunks: ['vendor', item.entryName]
  }
  webpackProdConfig.plugins.push(new HtmlWebpackPlugin(option))
})

module.exports = merge(webpackConfig, webpackProdConfig)
