import React from 'react'
// import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { render } from 'mirrorx'
import Lang from './lang'

renderAction()

function renderAction () {
  render(
    <AppContainer>
      <Lang />
    </AppContainer>,
    document.getElementById('root')
  )
}

if (module && module.hot) { // 热替换
  module.hot.accept()
}
