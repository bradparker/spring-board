const express = require('express')

const app = express()
const frontend = require('./frontend')

app.use(frontend.app)

app.listen(8080, () => {
  console.log('Server listening on 8080')
})
