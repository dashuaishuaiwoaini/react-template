import { StaticRouter } from 'react-router-dom'
import PageRouter from '../../src/route/router-ssr'
import '../../src/lib/common/T'
import Header from '../../src/component/common/header/Index'
var utils = require('../utils')
var config = require('../../config')
var fs = require('fs')
var path = require('path')
var React = require('react')
var ReactDOMServer = require('react-dom/server')

function getIndexHtml (req, props, lang) {
  var page = 'home'
  if (config.developMode) {
    page = 'home-dev'
  }
  var pathValue = path.resolve(__dirname, '../../public/' + page + '.html')
  var html = fs.readFileSync(pathValue)
  if (html) {
    html = html.toString()
  }

  html = handleHtml(html, req, props, lang)
  return html
}

function handleHtml (html, req, props, lang) {
  var currentLang = utils.getCurrentLang(req)
  var seoConfig = props.seoConfig || utils.seoConfig[currentLang] || {}

  // TODO： 正则可能有性能问题，待后续优化
  html = html.replace(/{{currentLang}}/gi, currentLang)
  html = html.replace(/{{lang}}/gi, lang || {})
  html = html.replace(/{{title}}/gi, seoConfig.title)
  html = html.replace(/{{content}}/gi, seoConfig.content)
  html = html.replace(/{{keywords}}/gi, seoConfig.keywords)

  return html
}

module.exports = function (req, res, props = {}, lang = {}) {
  var prePath = utils.getPrePath(req)
  var currentLang = utils.getCurrentLang(req)
  props = { ...props, ...{ currentLang: currentLang } }
  var content = ReactDOMServer.renderToStaticMarkup(
    <div>
      <Header initProps={props} lang={lang} />
      <StaticRouter
        basename={prePath}
        location={req.originalUrl}
        context={{}}
      >
        <PageRouter initProps={props} lang={lang} />
      </StaticRouter>
    </div>
  )

  var propsScript = '<script>var __initProps = ' + JSON.stringify(props) + '</script>'
  var htmlStr = getIndexHtml(req, props, lang)
  htmlStr = htmlStr.replace(/(<div\s+id=['"]root['"]\s*>).*(<\/div>)/gi, (_, $1, $2) => {
    return $1 + content + $2 + propsScript // + langScript
  })

  // var html = ReactDOMServer.renderToNodeStream(htmlStr)
  global.__initProps = null
  global.Lang = {}
  return htmlStr
}
