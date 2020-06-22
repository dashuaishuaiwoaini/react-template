var config = require('../config')
var proxy = require('http-proxy-middleware')
var utils = require('./utils')

function getProxy (opt) {
  opt = opt || {}
  var key = opt.key || 'ajax/proxy'
  var pathRewrite = {}
  pathRewrite['^/' + key] = ''
  opt.ajaxHost = opt.ajaxHost || config.ajaxHost
  var options = {
    target: 'http://' + opt.ajaxHost,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      utils.infoLog('proxy----http://' + opt.ajaxHost + req.originalUrl)
      if (opt.json) {
        proxyReq.setHeader('Content-Type', 'application/json')
      }
    },
    onError: (err, req, res) => {
      if (err) {
        utils.errorLog('proxy----' + err, req)
        res.end('something went wrong when proxy.' + err)
      }
    },
    pathRewrite: pathRewrite
  }
  var apiProxy = proxy(options)
  return apiProxy
}

module.exports = getProxy
