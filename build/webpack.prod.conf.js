const webpackBaseConfig = require('./webpack.base.conf.js')
const entriesConfig = require('../config')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const webpackConfig = {
  output: {
    filename: 'js/[name].[chunkhash:8].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/[name].[chunkhash:8].css',
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: 'vendor',
      filename: 'js/[name].[chunkhash:8].js',
      minChunks: 3
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    })
  ],
  devtool: 'source-map'
}

entriesConfig.forEach(item => {
  const option = {
    filename: item.filename,
    template: item.template,
    chunks: ['vendor', item.entryName]
  }
  webpackConfig.plugins.push(new HtmlWebpackPlugin(option))
})

module.exports = merge(webpackBaseConfig, webpackConfig)