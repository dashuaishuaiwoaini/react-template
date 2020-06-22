import React, { PureComponent } from 'react'
import './Index.scss'

// let langList = [
//   { id: 'en_US', value: 'En' },
//   { id: 'zh_HK', value: '繁' }
//   // { id: 'zh_CN', value: '简' }
// ]
class App extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      showLang: false
    }
  }

  handleChangeLang (lang) {
    let today = new Date()
    today.setFullYear(today.getFullYear() + 10)
    T.cookie.set('defaultLang', lang, { expires: today })
    setTimeout(() => {
      location.href = T.getChangeLangPath(lang)
    }, 0)
  }
  render () {
    let currentLang = T.getCurrentLang()

    return (
      <div className='header-lang-wrapper' >
        {/* <Dropdown overlay={menu}> */}
        {/* <Button type='link'> */}
        <div>
          <span className={`lang-btn ${currentLang === 'zh_HK' ? 'active-lang' : ''}`} onClick={() => this.handleChangeLang('zh_HK')}>繁</span>
          <span className='vertival-line'>|</span>
          <span className={`lang-btn ${currentLang === 'en_US' ? 'active-lang' : ''}`} onClick={() => this.handleChangeLang('en_US')}>EN</span>
        </div>
        {/* </Button> */}
        {/* </Dropdown> */}
      </div>
    )
  }
}
export default App
