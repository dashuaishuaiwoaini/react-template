import React from 'react'
import { Router } from 'mirrorx'
import T from './lib/common/T' // 公共工具
import './lib/common/lazyLoadImg' // 图片懒加载
import './lib/common/iconfont' // 字体图标
import './sass/index.scss'// 样式

import ErrorBoundary from './component/common/ErrorBoundary'
import PageRouter from './route/router'
import Header from 'component/common/header/Index'
import Loading from 'component/common/loading/Index'
// import './model'
import Api from './api'

window.T = T
window.Lang = window.Lang || {}
window.Api = Api || {}

function App () {
  return (
    <div className='main-wrapper'>
      <Header />
      <Router basename={T.getPrePath()} forceRefresh={!('pushState' in window.history)}>
        <ErrorBoundary>
          <PageRouter initProps={window.__initProps} />
        </ErrorBoundary>
      </Router>

      <Loading />
    </div>
  )
}

export default App
