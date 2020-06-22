import React from 'react'
import { Route, Switch } from 'mirrorx'
import routes from './routes-ssr'

class App extends React.Component {
  constructor (props = {}) {
    super(props)
    global.__initProps = props.initProps || global.__initProps || {}
    global.Lang = props.lang || global.Lang || {}
  }
  render () {
    return (
      <Switch>
        {
          routes.map((route, index) => (
            <Route key={index + 'route-render'} path={route.path} exact={route.exact} component={route.component} />
          ))
        }
      </Switch>
    )
  }
}

export default App
