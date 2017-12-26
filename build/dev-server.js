const express = require('express')
const webpack = require('webpack')
const opn = require('opn')

const webpackConfig = require('./webpack.dev.conf.js')

const app = express()

const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: '/',
  quiet: true
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})

const port = 8000

const uri = 'http://localhost:' + port

devMiddleware.waitUntilValid(() => {
  console.log('listening at ' + uri + '\n')
  opn(uri)
})

app.use(devMiddleware)

app.use(hotMiddleware)

app.listen(port)
