import React from 'react'
import { Route } from 'react-router'
import { Link } from 'react-router-dom'

export const routes = {
  index: {
    path: '/items',
    exact: true,
    fetch () {
      return Promise.resolve()
    }
  },
  new: {
    path: '/items/new',
    exact: true
  },
  show: {
    path: '/items/:itemId',
    exact: true
  },
  edit: {
    path: '/items/:itemId/edit',
    exact: true
  }
}

const Index = () => (
  <div>
    <p>Items</p>
    <Link to='/items/new'>
      Create item
    </Link>

    <ul>
      <li><Link to='/items/1'>Item 1</Link></li>
      <li><Link to='/items/2'>Item 2</Link></li>
    </ul>
  </div>
)

const New = () => (
  <form action='/items'>
    <label htmlFor='item[name]'>
      Name
    </label>
    <input name='item[name]' type='text' />
    <button>
      Submit
    </button>
  </form>
)

const Show = ({ item }) => (
  <div>
    <p>Item {item.id}</p>
    <Link to={`/items/${item.id}/edit`}>
      Edit
    </Link>
  </div>
)

const Edit = ({ item }) => (
  <form action={`/items/${item.id}`} method='PATCH'>
    <label htmlFor='item[name]' defaultValue={item.name}>
      Name
    </label>
    <input name='item[name]' type='text' />
    <button>
      Submit
    </button>
  </form>
)

export const Component = () => {
  const {
    index: indexRoute,
    new: newRoute,
    show: showRoute,
    edit: editRoute
  } = routes

  return (
    <div>
      <Route path={indexRoute.path} exact render={() => (
        <Index />
      )} />

      <Route path={newRoute.path} exact render={() => (
        <New />
      )} />

      <Route path={showRoute.path} exact render={({ match }) => (
        match.params.itemId !== 'new' &&
          <Show item={{ id: match.params.itemId }} />
      )} />

      <Route path={editRoute.path} exact render={({ match }) => (
        <Edit item={{ id: match.params.itemId }} />
      )} />
    </div>
  )
}
