const { join, resolve } = require('path')

const dist = join(__dirname, 'dist')
const context = resolve(__dirname, '../')

const rules = [
  {
    test: /\.js?$/,
    include: context,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['react', 'env']
        }
      }
    ]
  }
]

module.exports = [
  {
    name: 'client',
    target: 'web',
    entry: './client',
    context,
    module: { rules },
    output: {
      path: join(dist, 'assets'),
      publicPath: '/assets/',
      filename: '[name]-[hash].js'
    },
    devtool: 'source-map'
  }, {
    name: 'server',
    target: 'node',
    entry: './server',
    context,
    module: { rules },
    output: {
      path: dist,
      filename: 'index.js',
      libraryTarget: 'commonjs2'
    },
    devtool: 'source-map'
  }
]
