import React from 'react'
import '../lib/iconfont' // 字体图标

function IconDom (props) {
  return (
    <svg className={'icon ' + (props.className || '')} aria-hidden='true'>
      <use xlinkHref={'#' + props.code} />
    </svg>
  )
}
export default IconDom
