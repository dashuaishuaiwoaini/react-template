
var express = require('express')
var app = express()
var http = require('http')
var config = require('../config')
var nunjucks = require('nunjucks')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var compression = require('compression')
const chalk = require('chalk')
var path = require('path')
var utils = require('./utils')
const log = console.log
const portfinder = require('portfinder')
const warning = chalk.keyword('orange')
const error = chalk.bold.red

global.Lang = global.Lang || {}
global.__cdnpath = ''

/// ////// 加载中间件 //////////////////////////////////////
app.use(compression()) // 开启gzip
var sessionConfig = require('./session-config')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(sessionConfig) // 设置Express的Session存储中间件
app.use(function (req, res, next) {
  if (!req.session) {
    return next(new Error('redis connect fail')) // handle error
  }

  next() // otherwise continue
})

app.use(/^\/$/, function (req, res, next) {
  let currentLang = utils.getCurrentLang(req)
  console.log('当前语种', currentLang)
  if (currentLang !== utils.finalLang) {
    let path = utils.getPrePath(req)
    let url = req.originalUrl
    path = path + url
    res.setHeader('Cache-Control', 'max-age=0')
    res.redirect(301, path)
  } else {
    next()
  }
})

// ssr服务端渲染
app.use(/^\/$/, require('./ssr/index')) // 首页服务端渲染的时候 要在这里加SSR，不然会被下面的static路由拦截

/// //////////// 开发环境热更新打包 //////////////////////////
if (config.developMode) {
  var webpack = require('webpack')
  var webpackConfig = require('../build/webpack.dev.config.js')
  var webpackCompiled = webpack(webpackConfig)
  // 配置运行时打包
  var webpackDevMiddleware = require('webpack-dev-middleware')
  app.use(webpackDevMiddleware(webpackCompiled, {
    publicPath: '/',
    stats: { colors: true },
    lazy: false,
    watchOptions: {
      aggregateTimeout: 300
    }
  }))
  var webpackHotMiddleware = require('webpack-hot-middleware')
  app.use(webpackHotMiddleware(webpackCompiled))
}

/// ///////////  健康检查  ///////////////////////////////
app.get('/health', function (req, res) {
  return res.status(200).send('OK')
})
app.use('/favicon.ico', function (req, res) {
  res.end()
})

/// //////////// 设置view路径 //////////
nunjucks.configure('public', { // 设置模板文件的目录，为public
  autoescape: true,
  express: app,
  watch: true
})
app.set('view engine', 'html')

app.use(express.static(path.join(path.dirname(__dirname), 'public'), {
  setHeaders: function (res, path, stat) {
    if (res) {
      // console.log('add cache-control 3600s')
      res.setHeader('Cache-Control', 'max-age=3600') //  缓存对ssr会有影响  注意
    }
  }
}))

/// /////////// 代理转发 //////////////////////////////////////
var proxy = require('./proxy')
// form表单、文件上传的接口用这种代理会更方便//  使用前缀/ajx/proxy
app.use('/ajax/proxy/', proxy())
app.use(/^\/guojihua/i, proxy({ // 国际化的转发
  ajaxHost: config.i18nHost,
  json: true,
  key: 'guojihua'
}))

/// //////////  路由控制  ///////////////////////////

app.use(/^\/ajax/i, require('./ajax'))// ajax转发
app.use('/', require('./ssr/index'))// 服务端渲染
// app.use('/', require('connect-history-api-fallback')())

/// //////////  页面渲染  //////////////////////////
app.get('*', function (req, res) {
  res.setHeader('X-Frame-Options', 'DENY') // 防止点击劫持防御
  var page = 'home'
  if (config.developMode) {
    page = 'home-dev'
  }

  var currentLang = utils.getCurrentLang(req)
  var seoConfig = utils.seoConfig[currentLang] || {}
  res.render(page, {
    currentLang,
    title: seoConfig.title,
    content: seoConfig.content,
    keywords: seoConfig.keywords
  })
})

if (config.env === 'development') {
  // 开发环境配置
  portfinder.getPort({
    port: config.port,
    stopPort: 8085
  }, (err, port) => {
    if (err) {
      console.log('服务启动Error: ', err)
      return
    }
    /// ///////////  启动服务  /////////////////////
    http.createServer(app).listen(port, function () {
      console.log('-------------------------')
      log(chalk.blue('Your application is running here:'))

      log(warning('当前监听端口：', port))
      log(warning('当前环境：', config.env))
      log(warning('当前cookie所在域：', config.sessionConfig && config.sessionConfig.domain))

      log('--------------------------')

      if (config.developMode) {
        console.log(warning('-- 请耐心等待打包完毕... --'))
      }
    })
  })
} else {
  /// ///////////  启动服务  /////////////////////
  // 其他环境
  http.createServer(app).listen(config.port, function () {
    console.log('-------------------------')
    log(chalk.blue('Your application is running here:'))
    log(warning('当前cookie所在域：', config.sessionConfig && config.sessionConfig.domain))
    log('--------------------------')
  })
}

// 错误捕获
app.use(function (err, req, res, next) {
  log(error('错误信息:', err))
  log(error('错误信息请求地址:', req.originalUrl))
  console.log('------------------------------------------')
  res.end('An unknown error. Please try again.')
})
