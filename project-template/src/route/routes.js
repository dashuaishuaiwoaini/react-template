import React from 'react'
import Bundle from '../bundle.js'
import Empty from 'bundle-loader?lazy&name=empty!../pages/Empty'
import NoMatch from 'bundle-loader?lazy&name=404!../pages/404'

const WrapComponent = (Page) => (// 按需加载
  <Bundle load={Page}>
    {(Component) => <Component />}
  </Bundle>
)

const routes = [
  { path: '/empty', component: WrapComponent.bind(this, Empty) ,exact: true},
  { component: WrapComponent.bind(this, NoMatch) }
]

export default routes
