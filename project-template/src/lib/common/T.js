import axios from 'axios'
import { message } from 'antd'
import moment from 'moment'
import LangTool from './lang-tool'

var T = global.T = {
  ...LangTool,
  jump (path) {
    location.href = T.getPrePath() + '/' + path.replace(/^\/+/, '')
  },
  trim (str = '') {
    return str.replace(/^\s+|\s+$/g, '')
  },
  isDate (value) {
    return value instanceof Date || moment.isMoment(value)
  },
  htmlEncode: function (str) {
    if (typeof str !== 'string') return ''
    str = str.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
    // .replace(/&amp;#([^\;]+);/ig, "&#$1;"); //将&#20117;转成相应的汉字“井”
    return str
  },
  htmlDecode: function (str) {
    if (typeof str !== 'string') return ''
    str = str.replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, '\'')
      .replace(/&nbsp;/g, ' ')
    return str
  },
  ajax (opt) {
    let url = '/ajax/' + opt.url.replace(/^\//, '')
    let securecode = T.cookie.get('randomstr')
    let currentLang = T.getCurrentLang()
    let headers = opt.headers || {}
    if (securecode) {
      // let csrfParm = 'securecode=' + securecode
      // if (url.indexOf('?') > -1) {
      //   url += '&' + csrfParm
      // } else {
      //   url += '?' + csrfParm
      // }
      headers['authstring'] = securecode
    }
    if (currentLang) {
      headers['lang'] = currentLang
    }

    var param = {
      method: opt.method || 'post',
      withCredentials: true,
      url: url,
      data: opt.data,
      headers
    }

    if (opt.loading) {
      T.showLoading()
    }

    return new Promise(function (resolve, reject) {
      axios(param).then((result) => {
        let data = result.data || {}
        if (typeof data === 'object') {
          data.msg = data.msg || data.errorMsg
        }
        if (!data.success && !opt.notip) {
          T.showError(data.msg)
        }

        resolve(data)
      }).catch(function (error) {
        reject && reject(error)
        if (opt.loading) {
          T.hideLoading()
        }
        console.log(error)
      }).finally(() => {
        if (opt.loading) {
          T.hideLoading()
        }
      })
    })
  },
  showLoading () {
    if (T.get('loadingBox')) {
      T.get('loadingBox').style.display = 'block'
      // document.body.style.overflowY = 'hidden'
    }
  },
  hideLoading () {
    if (T.get('loadingBox')) {
      T.get('loadingBox').style.display = 'none'
      // document.body.style.overflowY = 'auto'
    }
  },
  get: function (id) {
    if (!global.document) {
      return null
    }
    return global.document.getElementById(id)
  },
  showInfo (msg) {
    message.info(msg)
  },
  showSuccess (msg) {
    message.success(msg)
  },
  showError (msg, time) {
    if (msg) {
      if (typeof msg === 'object') {
        msg = JSON.stringify(msg)
      }
      message.error(msg, time)
    }
  },
  showWarn (msg, time) {
    message.warning(msg, time)
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
      console.log('[eval error json解析错误]' + e.message)
    }
    return result
  },
  urlQuery: function (key, url) {
    if (!global.location) {
      return
    }
    url = url || global.location.href
    var reg = new RegExp('[?&#]' + key + '=([^&#]*)', 'i')
    var match = url.match(reg)
    var result

    if (match) {
      try {
        result = decodeURIComponent(match[1]) || ''
        return result
      } catch (e) {
      }
    }
    return ''
  },
  formatDate: function (format, date) { //   "yyyy-MM-dd hh:mm:ss"
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
  isArray: function (obj) {
    return Object.prototype.toString.apply(obj) === '[object Array]'
  },
  isObject: function (obj) {
    return Object.prototype.toString.apply(obj) === '[object Object]'
  },
  getAttrObject: function (objArray, key, value) { // 一个对象数组，获取key等于value的对象数组
    objArray = (objArray instanceof Array) ? objArray : [objArray]
    var arr = []
    var item
    var temp
    for (var i = 0; i < objArray.length; i++) {
      item = objArray[i]
      if (item === undefined) {
        continue
      }
      temp = (key instanceof Array) ? item[key[0]][key[1]] : item[key]

      if (value instanceof Array) {
        if (value.indexOf(temp) > -1) {
          arr.push(item)
        }
      } else {
        if (temp + '' === value + '') { // 此处不要改为全等
          arr.push(item)
        }
      }
    }

    return arr
  },
  pluck: function (objArray, key) {
    var values = []
    if (!key) {
      return objArray
    }

    try {
      var temp
      var item
      for (var i = 0, len = objArray.length; i < len; i++) {
        item = objArray[i]
        temp = (key instanceof Array) ? item[key[0]][key[1]] : item[key]
        if (temp === undefined) {
          continue
        }
        values.push(temp)
      }
      return values
    } catch (e) {
      return values
    }
  },
  sum (arr) {
    return arr.reduce(function (prev, curr, idx, arr) {
      return Number(prev) + Number(curr)
    })
  },
  cookie: {
    get: function (name) {
      if (!global.document || !name) {
        return ''
      }
      var cookie = (global.document && global.document.cookie) || ''
      let reg = new RegExp('(^|(;\\s*))' + name + '=[^;]+', 'gi')
      let value = (cookie.match(reg) || [])[0] || ''
      value = value.replace(/[\s;]*/gi, '').split('=')[1] || ''

      return value
    },
    set: function (name, value, param) {
      if (!global.document) {
        return
      }
      var text = encodeURIComponent(name) + '=' + encodeURIComponent(value)
      param = param || {}
      param.path = param.path || '/'
      param.domain = param.domain || ('.' + location.hostname.split('.').slice(-2).join('.'))
      var expires = param.expires
      if (expires instanceof Date) {
        text += ';expires=' + expires.toGMTString()
      } else if (typeof expires === 'number') {
        text += ';expires=' + new Date(expires).toGMTString()
      }
      if (param.path) {
        text += ';path=' + param.path
      }
      if (param.domain) {
        text += ';domain=' + param.domain
      }
      if (param.secure) {
        text += ';secure'
      }
      global.document.cookie = text
    },
    unset: function (name, path, domain, secure) {
      this.set(name, '', new Date(0), path, domain, secure)
    }
  },
  loadScript (src, callback, id = '') {
    if (!src) {
      return
    }
    var node = document.createElement('script')
    node.type = 'text/javascript'
    node.async = true
    node.src = src
    node.id = id
    var head = document.getElementsByTagName('head')[0]
    head.appendChild(node)
    if (callback) {
      node.onload = callback
    }
  },
  loadLink (src, callback) {
    if (!src) {
      return
    }
    var node = document.createElement('link')
    node.rel = 'stylesheet'
    node.href = src
    var head = document.getElementsByTagName('head')[0]
    head.appendChild(node)
    if (callback) {
      node.onload = callback
    }
  },
  getScreenHeight () {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  },
  localStorage: {
    set (key, value) {
      if (typeof value === 'object') {
        value = JSON.stringify(value)
      }
      global.localStorage && global.localStorage.setItem(key, value)
    },
    get (key, value) {
      return global.localStorage && global.localStorage.getItem(key)
    },
    remove (key, value) {
      global.localStorage && global.localStorage.removeItem(key)
    },
    clear () {
      global.localStorage && global.localStorage.clear()
    }
  },
  sessionStorage: {
    set (key, value) {
      if (typeof value === 'object') {
        value = JSON.stringify(value)
      }
      global.sessionStorage && global.sessionStorage.setItem(key, value)
    },
    get (key, value) {
      return global.sessionStorage && global.sessionStorage.getItem(key)
    },
    remove (key, value) {
      global.sessionStorage && global.sessionStorage.removeItem(key)
    },
    clear () {
      global.sessionStorage && global.sessionStorage.clear()
    }
  },
  isHKID (str) {
    var strValidChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    // basic check length
    if (str.length < 8) { return false }

    // handling bracket
    if (str.charAt(str.length - 3) === '(' && str.charAt(str.length - 1) === ')') { str = str.substring(0, str.length - 3) + str.charAt(str.length - 2) }

    // convert to upper case
    str = str.toUpperCase()

    // regular expression to check pattern and split
    var hkidPat = /^([A-Z]{1,2})([0-9]{6})([A0-9])$/
    var matchArray = str.match(hkidPat)

    // not match, return false
    if (matchArray == null) { return false }

    // the character part, numeric part and check digit part
    var charPart = matchArray[1]
    var numPart = matchArray[2]
    var checkDigit = matchArray[3]

    // calculate the checksum for character part
    var checkSum = 0
    if (charPart.length === 2) {
      checkSum += 9 * (10 + strValidChars.indexOf(charPart.charAt(0)))
      checkSum += 8 * (10 + strValidChars.indexOf(charPart.charAt(1)))
    } else {
      checkSum += 9 * 36
      checkSum += 8 * (10 + strValidChars.indexOf(charPart))
    }

    // calculate the checksum for numeric part
    for (var i = 0, j = 7; i < numPart.length; i++, j--) { checkSum += j * numPart.charAt(i) }

    // verify the check digit
    var remaining = checkSum % 11
    var verify = remaining === 0 ? 0 : 11 - remaining

    return verify === +checkDigit || (verify === 10 && checkDigit === 'A')
  },
  regObj: {
    email: /^(?:[\w-]+\.?)*[\w-]+@(?:\w+\.)+\w+$/,
    firstName: /^[a-zA-Z\s]{2,}$/,
    givenName: /^[a-zA-Z\s]{2,}$/,
    name: /^[\u4e00-\u9fa5a-zA-Z\s]{2,}$/,
    hkid: /^((\s?[A-Za-z])|([A-Za-z]{2}))\d{6}(([0−9aA])|([0-9aA]))$/,
    phoneNumber: /^[5689]{1}[0-9]{7}$/i
  },
  formatPrice (num) {
    // console.log(num)
    if (num === undefined) {
      return ''
    }
    num = num + ''
    num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return num
  },
  // 判断一个值是否在数组里 value: string value: Array
  isInArray (value = '', arr = []) {
    return arr.some(i => i === value)
  },
  // 模板引擎,主要是为了处理国际化时多个变量
  template (str = '', replaceMap = {}) {
    // /(?<={)[^}]+(?=})/g  有些不支持 <的语法
    let array = str.match(/(?={)[^}]+}/g) || []
    if (!str || Object.prototype.toString.call(replaceMap) !== '[object Object]') {
      return str
    }
    array.forEach((item) => {
      let key = item.replace('{', '').replace('}', '').replace(/\s+/, '')
      if (replaceMap && replaceMap[key]) {
        str = str.replace(item, replaceMap[key])
      }
    })
    return str
  }
}

export default T
