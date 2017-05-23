import React from 'react'
import { render } from 'react-dom'
import initApp from '../shared'
import { BrowserRouter as Router } from 'react-router-dom'

const { component: App } = initApp()
const mount = document.getElementById('app')

render(
  <Router>
    <App />
  </Router>,
  mount
)
