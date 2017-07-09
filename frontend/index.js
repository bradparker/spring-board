const express = require('express')
const path = require('path')
const app = express()

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackServerMiddleware = require('webpack-server-middleware')
  const config = require('./config/compiler.js')
  const compiler = webpack(config)
  app.use(webpackDevMiddleware(compiler))
  app.use(webpackServerMiddleware(compiler))
} else {
  const DIST_DIR = path.join(__dirname, './dist')
  const SERVER_RENDERER_PATH = path.join(DIST_DIR)
  const CLIENT_STATS_PATH = path.join(DIST_DIR, 'stats.json')
  const serverRenderer = require(SERVER_RENDERER_PATH)
  const stats = require(CLIENT_STATS_PATH).children.find((c) => c.name === 'client')
  app.use(express.static(DIST_DIR))
  app.use(serverRenderer(stats))
}

module.exports = { app }
