import React from 'react'
import { Route, Switch } from 'mirrorx'
import routes from './routes'
import routesSsr from './routes-ssr'

class App extends React.Component {
  constructor (props = {}) {
    super(props)
    global.__initProps = props.initProps || global.__initProps || {}
    global.Lang = props.lang || global.Lang || {}
  }
  // shouldComponentUpdate () {
  //   return false
  // }

  render () {
    let routesArr = [...routesSsr, ...routes]
    return (
      <Switch>
        {
          routesArr.map((route, index) => (
            <Route key={index + 'route-render'} path={route.path} exact={route.exact} component={route.component} />
          ))
        }
      </Switch>
    )
  }
}

export default App
