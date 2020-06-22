const LangOptions = ['en_US', 'zh_HK']
const LangPath = ['en', 'hk']
const FinalLang = 'en_US' // 兜底默认语种
const IsUseAutoDefaultLang = true // 是否自动取浏览器语言偏好
const NavigatorLangMap = {
  'zh': 'zh_HK',
  'zh-cn': 'zh_HK',
  'zh-hk': 'zh_HK',
  'zh-tw': 'zh_HK',
  'zh-sg': 'zh_HK',
  'en': 'en_US',
  'en-us': 'en_US'
}

const [LangMap, PathMap] = (() => {
  let langMap = {}
  let pathMap = {}
  let pathItem
  LangOptions.forEach((item, index) => {
    pathItem = LangPath[index]
    langMap[item] = pathItem
    pathMap[pathItem] = item
  })
  return [langMap, pathMap]
})()

const FinalPath = LangMap[FinalLang]

// node端和客户端公用这些方法
const LangTool = {
  finalLang: FinalLang,
  getDefaultLang (req) {
    let language
    if (req) {
      language = req.headers['accept-language'] || ''
      if (language) {
        language = language.split(',')[0] || ''
      }
    } else {
      if (global.navigator) {
        language = navigator.language
      }
    }

    if (!language || !IsUseAutoDefaultLang) { // 兜底
      console.log('error | 没有取到语言偏好！！' + req.originalUrl)
      return FinalLang
    }

    language = language.toLowerCase()
    return NavigatorLangMap[language] || FinalLang // 兜底
  },
  defaultLangPath (req) {
    if (!global.navigator && !req) {
      return ''
    }

    let defaultLang
    if (req) {
      defaultLang = req.cookies['defaultLang']
    } else {
      defaultLang = T.cookie.get('defaultLang')
    }

    if (defaultLang) {
      return LangMap[defaultLang]
    }

    let language = LangTool.getDefaultLang(req)
    return LangMap[language] || FinalPath // 兜底
  },
  getPrePath (req) {
    if (!req && !global.location) {
      return ''
    }

    let pathname
    if (req) {
      pathname = req.path || ''
    } else {
      pathname = location.pathname
    }
    let pathMatch = pathname.match(/^\/(\w+)(\/|\b)/) || []
    let path = pathMatch[1]
    let prepath
    if (LangPath.includes(path)) {
      prepath = path
    } else {
      prepath = LangTool.defaultLangPath(req)
    }
    return ('/' + prepath)
  },
  getCurrentLang (req) {
    if (!req) {
      if (global.__initProps && global.__initProps.currentLang) {
        return global.__initProps.currentLang
      } else {
        if (!global.location) {
          console.log('不能在ssr时执行.......' + req.originalUrl)
        }
      }
    } else {
      let currentLang = req.headers['lang'] || req.query.currentLang
      if (currentLang) {
        return currentLang
      }
    }

    let prePath = LangTool.getPrePath(req)
    prePath = prePath.replace('/', '')
    return PathMap[prePath] || FinalLang
  },
  getChangeLangPath (lang) {
    let currentLang = LangTool.getCurrentLang()
    if (lang === currentLang) {
      return location.href
    }

    let langPath = LangMap[currentLang]
    let changeLangPath = LangMap[lang]
    let href = location.href
    // let defualtLangPath = LangMap[FinalLang]
    if (lang !== FinalLang) {
      if (location.pathname.replace(/\//g, '') === '') {
        href = '/' + changeLangPath + '/'
      } else {
        href = href.replace('/' + langPath, '/' + changeLangPath)
      }
    } else {
      if (location.pathname.replace(/\//g, '') === langPath) {
        href = '/'
      } else {
        href = href.replace('/' + langPath, '/' + changeLangPath)
      }
    }

    // if (langPath === LangTool.defaultLangPath()) {
    //   if (location.pathname.replace(/\//g, '') === '') {
    //     href = '/' + changeLangPath
    //   } else {
    //     href = href.replace('/' + langPath, '/' + changeLangPath)
    //   }
    // } else {
    //   if (location.pathname.replace(/\//g, '') === langPath && changeLangPath === LangTool.defaultLangPath()) {
    //     href = '/'
    //   } else {
    //     href = href.replace('/' + langPath, '/' + changeLangPath)
    //   }
    // }

    return href
  }
}

export default LangTool
