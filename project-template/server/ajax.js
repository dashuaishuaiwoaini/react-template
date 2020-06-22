var express = require('express')
var router = express.Router()
var utils = require('./utils')
var config = require('../config')
var cuid = require('cuid')
var sessionKeys = config.sessionKeys

router.all('/getUserInfo', function (req, res, next) {
  var userInfo = req.session[sessionKeys.userInfo] || {}
  res.json({ success: true, value: userInfo })
})

router.all('*', function (req, res, next) {
  if (!csrfCheck(req)) {
    res.send(JSON.stringify({ success: false, msg: '不安全的请求' }))
    return
  }

  var reqData = req.body || {}
  var url = req.originalUrl.replace(/^\/ajax/i, '')

  // let userInfo = req.session[sessionKeys.userInfo] || {}
  // if (reqData.partnerId === '' && userInfo) { //如请求中需要传用户id  在这里统一处理
  //   reqData.partnerId = userInfo.partnerId
  // }

  const ajaxParam = {
    url: url,
    method: req.method || 'POST',
    data: reqData,
    host: config.ajaxHost,
    headers: {
      'lang': utils.getCurrentLang(req),
      'userToken': req.session[sessionKeys.userToken] || ''
    }
  }

  utils.ajax(ajaxParam).then((json) => {
    handleSuccess(url, json, req, res)
    res.send(JSON.stringify(json))
  }, (error) => {
    // utils.errorLog('Ajax Send Fail', req)
    res.send(JSON.stringify({ success: false, msg: error }))
  }).catch((error) => {
    utils.errorLog('Ajax Send Error', req)
    res.send(JSON.stringify({ success: false, msg: error }))
  })
})

function handleSuccess (url, json, req, res) {
  if (url.indexOf('/user/sign/in') === 0) {
    if (json && json.success && json.value) {
      if (json.value.userToken) {
        req.session[sessionKeys.userToken] = json.value.userToken

        json.value.isLogin = true
        delete json.value.userToken

        req.session[sessionKeys.userInfo] = json.value

        let securecode = cuid()
        req.session[sessionKeys.securecode] = securecode
        utils.cookie.set(res, 'randomstr', securecode)
      }
    }
  } else if (url.indexOf('/user/sign/out') === 0) {
    req.session[sessionKeys.userInfo] = null
    req.session[sessionKeys.userToken] = null
    // T.cookie.clear(res, config.sessionConfig.name) 配置完对应的session之后，需要打开这里
  }
}

function csrfCheck (req) {
  if (!req.session[sessionKeys.userToken]) {
    return true
  } else {
    if (req.headers.authstring !== req.session[sessionKeys.securecode]) {
      return false
    }
    return true
  }
}

module.exports = router
