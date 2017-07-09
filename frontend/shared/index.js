import React from 'react'
import { Route } from 'react-router'
import { Link } from 'react-router-dom'

import {
  Component as Items,
  routes as items
} from './modules/Items'

const {keys} = Object

const Home = () => (
  <p>Home</p>
)

export const Component = () => (
  <div>
    <nav>
      <Link to='/'>
        Home
      </Link>
      <Link to='/items'>
        Items
      </Link>
    </nav>

    <Route path='/' exact component={Home} />
    <Route path='/items' component={Items} />
  </div>
)

const values = (obj) => (
  keys(obj).map((key) => (
    obj[key]
  ))
)

export const routes = [
  { path: '/', exact: true }
].concat((values(items)))
