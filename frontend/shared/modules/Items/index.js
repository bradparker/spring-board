import React from 'react'
import { Route } from 'react-router'
import { Link } from 'react-router-dom'
import { join } from 'path'

const routes = ({ mountAt }) => ({
  index: {
    pattern: join(mountAt, '/')
  },
  new: {
    pattern: join(mountAt, '/new')
  },
  show: {
    pattern: join(mountAt, '/:itemId')
  },
  edit: {
    pattern: join(mountAt, '/:itemId/edit')
  }
})

const Index = ({ mountedAt = '' }) => (
  <div>
    <p>Items</p>
    <Link to={join(mountedAt, '/new')}>
      Create item
    </Link>

    <ul>
      <li><Link to={join(mountedAt, '/1')}>Item 1</Link></li>
      <li><Link to={join(mountedAt, '/2')}>Item 2</Link></li>
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

const Show = ({ item, mountedAt }) => (
  <div>
    <p>Item {item.id}</p>
    <Link to={join(mountedAt, `/${item.id}/edit`)}>
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

const component = ({ mountAt }) => {
  const mountedRoutes = routes({ mountAt })
  const { pattern: indexPattern } = mountedRoutes.index
  const { pattern: newPattern } = mountedRoutes.new
  const { pattern: showPattern } = mountedRoutes.show
  const { pattern: editPattern } = mountedRoutes.edit

  return () => (
    <div>
      <Route path={indexPattern} exact render={() => (
        <Index mountedAt={mountAt} />
      )} />

      <Route path={newPattern} exact render={() => (
        <New />
      )} />

      <Route path={showPattern} exact render={({ match }) => (
        match.params.itemId !== 'new' &&
          <Show item={{ id: match.params.itemId }} mountedAt={mountAt} />
      )} />

      <Route path={editPattern} render={({ match }) => (
        <Edit item={{ id: match.params.itemId }} />
      )} />
    </div>
  )
}

export default ({
  mountAt = '/items'
} = {}) => ({
  component: component({ mountAt }),
  routes: routes({ mountAt })
})
