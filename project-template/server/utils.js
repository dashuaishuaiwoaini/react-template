import LangTool from '../src/lib/common/lang-tool'
var config = require('../config')
var axios = require('axios')

var T = {
  ...LangTool,
  seoConfig: {
    en_US: {
      title: 'hello word',
      content: 'hello word content',
      keywords: 'hello word keywords'
    },
    zh_HK: {
      title: 'hello word1',
      content: 'hello word content1',
      keywords: 'hello word keywors1'
    }
  },
  getNowDate (date = new Date()) {
    var now = new Date()
    return [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-') + ' ' + [now.getHours(), now.getMinutes(), now.getSeconds()].join(':')
  },
  errorLog: function (msg = '', req) {
    T.log(msg, req, true)
  },
  infoLog: function (msg = '', req) {
    T.log(msg, req, false)
  },
  log: function (msg = '', req, isError) {
    let url = ''
    if (req) {
      url = req.hostname + req.originalUrl
    }

    if (url) {
      msg = url + ' | ' + msg
    }

    let str = [isError ? 'Error' : 'Info', T.getNowDate(), msg].join(' | ')
    console.log(str)
  },
  getIntlData: function (req, res, callbackFun) {
    setTimeout(() => {
      callbackFun && callbackFun({
        test1: 'test1 content',
        test2: 'test2 content'
      })
    }, 0)

    // let currentLang = T.getCurrentLang(req)
    // var url = '/i18n-proxy/i18n/resource/download.json?namespace=zabank_portal_front&lang=' + currentLang
    // T.ajax({
    //   url: url,
    //   method: 'get',
    //   timeout: 5000,
    //   host: config.i18nHost
    // }).then((json = {}) => {
    //   let data = json.value
    //   callbackFun && callbackFun(data)
    // }, (error) => {
    //   console.log('reject....', error)
    //   callbackFun && callbackFun()
    // }).catch((error) => {
    //   console.log('catch....', error)
    //   callbackFun && callbackFun()
    // })
  },
  formatDate (format, date) {
    if (!date || !format) {
      return ''
    }
    if (typeof date === 'string') {
      date = date.replace(/-/g, '/')
    }
    date = new Date(date)
    var o = {
      'M+': date.getMonth() + 1, // month
      'd+': date.getDate(), // day
      'h+': date.getHours(), // hour
      'm+': date.getMinutes(), // minute
      's+': date.getSeconds(), // second
      'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
      'S': date.getMilliseconds(), // millisecond
      'w': '日一二三四五六'.charAt(date.getDay())
    }
    format = format.replace(/y{4}/i, date.getFullYear())
      .replace(/y{2}/i, date.getFullYear().toString().substring(2))

    for (var k in o) {
      var reg = new RegExp(k)
      format = format.replace(reg, match)
    }
    function match (m) {
      return m.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
    }
    return format
  },
  ajax (opt) {
    var host = opt.host || config.ajaxHost
    var port = opt.port || config.ajaxPort || 80
    var headers = opt.headers || {}

    if (config.mock && config.mockHost) {
      host = config.mockHost
      opt.url = '/mock/16' + opt.url
    }

    var protocol = 'http'
    if (config.env === 'dev') {
      protocol = 'http'
    }

    var param = {
      baseURL: protocol + '://' + host,
      method: opt.method || 'post',
      withCredentials: true,
      url: opt.url,
      timeout: opt.timeout || 10000,
      data: opt.data,
      headers: headers
    }

    if (port && port !== 80 && host.indexOf(':') < 0) {
      param.baseURL = param.baseURL + ':' + port
    }

    let allUrl = param.baseURL + param.url
    T.infoLog(allUrl + '| Ajax Begin Send')

    return new Promise(function (resolve, reject) {
      axios(param).then((result) => {
        let data = result.data
        resolve(data)
        T.infoLog(allUrl + '| Ajax Send Success')
      }).catch(function (error = {}) {
        reject && reject(error.message)
        T.errorLog(allUrl + '| Ajax Send Fail | ' + JSON.stringify(param) + ' | ' + error.message)
      })
    })
  },
  cookie: {
    set (res, key, value, obj = {}) {
      let option = {
        domain: obj.domain || config.sessionConfig.domain,
        path: obj.path || '/',
        secure: obj.secure || false,
        httpOnly: obj.httpOnly || false
      }
      res.cookie(key, value, option)
    },
    clear (res, key, obj = {}) {
      let option = {
        domain: obj.domain || config.sessionConfig.domain,
        path: obj.path || '/'
      }
      res.clearCookie(key, option)
    }
  },

  matchPath: function (arr, req) {
    let url = req.path
    let prePath = T.getPrePath(req)
    url = url.replace(prePath, '')
    return arr.some(function (item) {
      return item.path && (!item.client) && item.path.replace(/^\/+|\/+$/, '') === url.replace(/^\/+|\/+$/, '')
    })
  },
  getObjStr: function (data) {
    if (typeof data === 'string') {
      return data
    }
    var arr = []
    for (var p in data) {
      if (typeof data[p] === 'object') {
        data[p] = JSON.stringify(data[p])
      }
      arr.push(p + '=' + encodeURIComponent(data[p]))
    }
    return arr.join('&')
  },
  tryEval: function (js) {
    var result = null
    if (!js) {
      return result
    }
    if (typeof js !== 'string') {
      return js
    }
    try {
      result = JSON.parse(js)
    } catch (e) {
      T.errorLog('[eval error json解析错误]' + e.message)
    }
    return result
  },
  getCurrentUrl: function (req, host) {
    host = host || req.hostname
    if (config.developMode && host.indexOf(':') < 0) {
      host = host + ':' + config.port
    }
    return req.protocol + '://' + host + req.originalUrl
  },
  isArray: function (obj) {
    return Object.prototype.toString.apply(obj) === '[object Array]'
  },
  isObject: function (obj) {
    return Object.prototype.toString.apply(obj) === '[object Object]'
  }
}

module.exports = T
