import React from 'react'

class Error extends React.Component {
  render () {
    return (<div className='nomatch-box common-wrap'>
      <img src='https://cdn.za.group/if/za-care-portal-web/assets/images/404.png' alt='' />
      <p className='text'>出了點問題, 請再試一試</p>
      <a href='/'>Back</a>
    </div>)
  }
}

export default Error
