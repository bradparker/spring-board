import React from 'react'
import { Route } from 'react-router'
import { Link } from 'react-router-dom'

import initItems from './modules/Items'

const {
  component: Items,
  routes: items
} = initItems({
  mountAt: '/items'
})

const Home = () => (
  <p>Home</p>
)

const component = () => () => (
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

const routes =  () => ({
  home: {
    pattern: '/'
  },
  items
})

export default () => ({
  component: component(),
  routes: routes()
})
