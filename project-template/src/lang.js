import React from 'react'

import { IntlProvider, addLocaleData } from 'react-intl'

import 'intl'
import zh from 'react-intl/locale-data/zh'
import en from 'react-intl/locale-data/en'

import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import zhTW from 'antd/lib/locale-provider/zh_TW'
import enUS from 'antd/lib/locale-provider/en_US'

import Main from './main'

addLocaleData([...en, ...zh])

function App () {
  const locale = navigator.language.split('-')[0]
  const lang = window.Lang
  const currentLang = T.getCurrentLang()
  let localMap = {
    'zh_CN': zhCN,
    'zh_TW': zhTW,
    'en_US': enUS
  }
  let reactLocale = localMap[currentLang] || enUS
  return (<div>
    <IntlProvider locale={locale} messages={lang}>
      <LocaleProvider locale={reactLocale}>
        <Main />
      </LocaleProvider>
    </IntlProvider>
  </div>
  )
}

export default App
