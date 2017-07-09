import React from 'react'
import { render } from 'react-dom'
import { Component as App } from '../shared'
import { BrowserRouter as Router } from 'react-router-dom'

const mount = document.getElementById('app')

render(
  <Router>
    <App />
  </Router>,
  mount
)
