import React from 'react'
import { Button } from 'antd'
import PropTypes from 'prop-types'
import './Index.scss'

import SwitchLang from '../switch-lang/Index'

// import { FormattedMessage } from 'react-intl'
import API from '../../../api'

const logoutRequest = () => {
  T.ajax({
    url: API.signout.url,
    loading: true
  }).then((result) => {
    if (result.success) {
      window.location.href = '/'
    }
  })
}

function App (props) {
  global.__initProps = props.initProps || global.__initProps || {}
  global.Lang = props.lang || global.Lang || {}

  return (
    <div className='header-wrapper clearfix'>
      <div className='fl'>我是{props.title}</div>
      <div className='fl ml50'>
        <SwitchLang />
      </div>
      <div className='fr'>

        <Button
          type='primary'
          onClick={logoutRequest}>退出</Button>
      </div>
    </div>
  )
}

App.propTypes = {
  title: PropTypes.string
}

App.defaultProps = {
  title: '公共Header'
}

export default App
