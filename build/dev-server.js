const express = require('express')
const webpack = require('webpack')
const opn = require('opn')

const webpackConfig = require('./webpack.dev.conf.js')


const app = express()

const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

const hotMiddleware = require("webpack-hot-middleware")(compiler,{
  log: () => {},
  heartbeat: 2000
})

compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function(data, cb){
    hotMiddleware.publish({action: 'reload'})
    cb()
  })
})

const port = 8000

const uri = 'http://localhost:' + port

devMiddleware.waitUntilValid(() => {
  console.log('listening at ' + uri + '\n');
  opn(uri)
})

app.use(devMiddleware)

app.use(hotMiddleware)

app.listen(port, function () {
  console.log('listening')
})
