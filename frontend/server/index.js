import React from 'react'
import {StaticRouter as Router, matchPath} from 'react-router'
import {renderToString} from 'react-dom/server'
import {join, extname} from 'path'
import {Component as App, routes} from '../shared'

const {keys, assign} = Object

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

module.exports = (stats) => {
  const publicPath = stats.publicPath
  const assets = byExtension(extractAssets(stats))
  const scriptTags = scripts(publicPath, assets)

  return (req) => {
    const requests = routes.reduce((acc, route) => {
      const match = matchPath(req.url, route)
      if (match && route.fetch) return acc.concat(route.fetch())
      return acc
    }, [])

    return Promise.all(requests).then(() => {
      const content = renderToString(
        <Router context={{}} location={req.url}>
          <App />
        </Router>
      )

      return ({
        body: (
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
      })
    }).catch((error) => {
      console.log(error)
      return Promise.reject(error)
    })
  }
}
