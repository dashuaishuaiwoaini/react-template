import routes from '../../src/route/routes-ssr'
var express = require('express')
var router = express.Router()
var template = require('./template')
var utils = require('../utils')

function consoleLog (req) {
  var ip = req.header('x-forwarded-for') || (req.connection && req.connection.remoteAddress) || ''
  console.log('---------' + utils.formatDate('yyyy-MM-dd hh:mm:ss', new Date()) + '-----------------')
  console.log('【Welcome clientIP】' + ip)
  console.log('【Navigator userAgent】' + req.headers['user-agent'])
  console.log('--------------------------')
}

router.get(/^\/$/, function (req, res, next) {
  consoleLog(req)
  next()
})

// router.get('/tt', function (req, res, next) {
//   var props = {
//     initialCount: 1001
//   }
//   var html = template(req, res, props)
//   res.end(html)
// })

router.get('*', function (req, res, next) {
  res.setHeader('X-Frame-Options', 'DENY') // 防止点击劫持防御
  let isMatch = utils.matchPath(routes, req)
  if (!isMatch) {
    next()
    return
  }

  utils.getIntlData(req, res, (langData) => { // 获取国际化数据
    var html = template(req, res, {}, langData)
    // html.pipe(res)
    res.end(html)
  })
})

module.exports = router
