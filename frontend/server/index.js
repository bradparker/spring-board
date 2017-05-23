import React from 'react'
import { StaticRouter as Router, matchPath } from 'react-router'
import { renderToString } from 'react-dom/server'
import { join, extname } from 'path'
import initApp from '../shared'

const { keys, assign } = Object

const flatMap = (array, func) => (
  array.reduce((result, element) => (
    result.concat(func(element))
  ), [])
)

const byExtension = (paths) => (
  paths.reduce((acc, path) => (assign(acc, {
    [extname(path)]: (acc[extname(path)] || []).concat(path)
  })), {})
)

const extractAssets = ({ assetsByChunkName = {} } = {}) => (
  flatMap(keys(assetsByChunkName), (chunkName) => (
    assetsByChunkName[chunkName]
  ))
)

const scripts = (publicPath, assets) => (
  assets['.js'].map((path) => (
    `<script src="${join(publicPath, path)}"></script>`
  )).join('')
)

const { component: App } = initApp()

module.exports = (stats) => {
  const publicPath = stats.publicPath
  const assets = byExtension(extractAssets(stats))
  const scriptTags = scripts(publicPath, assets)

  return (req, res, next) => {
    const content = renderToString(
      <Router context={{}} location={req.url}>
        <App />
      </Router>
    )

    res.send(
      `<!doctype html>
      <html>
        <head>
          <title>Hey, there</title>
        </head>
        <body>
          <main id="app">${content}</main>
          ${scriptTags}
        </body>
      </html>`
    )
  }
}
