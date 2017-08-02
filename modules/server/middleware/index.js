const path = require('path')
const requireFromString = require('require-from-string')

const interopRequireDefault = (obj) => (
  obj && obj.__esModule ? obj.default : obj
)

const findCompiler = (multiCompiler, name) => (
  multiCompiler.compilers.find(compiler => compiler.name === name)
)

const findStats = (multiStats, name) => (
  multiStats.stats.find(stats => stats.compilation.name === name)
)

const getServerRenderer = (filename, buffer, clientStats, serverStats) => {
  const createServerRenderer = interopRequireDefault(
    requireFromString(buffer.toString(), filename)
  )
  const serverRenderer = createServerRenderer(
    clientStats.toJson(),
    serverStats.toJson()
  )

  return serverRenderer
}

const webpackHotServerMiddleware = (multiCompiler, options) => {
  const serverCompiler = findCompiler(multiCompiler, 'server')
  const clientCompiler = findCompiler(multiCompiler, 'client')

  const { outputFileSystem } = serverCompiler
  const { outputPath } = serverCompiler

  let serverRenderer
  let error = null

  multiCompiler.plugin('done', multiStats => {
    error = null
    const clientStats = findStats(multiStats, 'client')
    const serverStats = findStats(multiStats, 'server')
    if (serverStats.compilation.errors.length) {
      error = serverStats.compilation.errors[0]
      return
    }
    const filename = path.join(outputPath, 'index.js')
    const buffer = outputFileSystem.readFileSync(filename)

    try {
      serverRenderer = getServerRenderer(
        filename,
        buffer,
        clientStats,
        serverStats
      )
    } catch (e) {
      error = e
    }
  })

  return (req, res, next) => {
    if (error) return next(error)

    serverRenderer(req).then(({
      status = 200,
      headers = {},
      body = null
    }) => {
      res.status(status)
      res.set(headers)
      res.send(body)
    }).catch((e) => {
      next(e)
    })
  }
}

module.exports = webpackHotServerMiddleware
