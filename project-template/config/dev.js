var common = require('./common')
module.exports = Object.assign({}, common.config, {
  'env': 'development',
  'redisConfig': {

  },
  'sessionConfig': Object.assign({}, common.sessionConfig, {
    'domain': '.za-tech.net'
  }),
  'i18nHost': '16228-yfyb-anan-za-graphene-i18n-iterative-version.test.za-tech.net', // 国际化的接口host
  'ajaxHost': '15785-yfyb-anan-anan-nsso.test.za-tech.net', // 当前应用的接口host
  'staticResHost': 'static-test.zhongan.io' // 国际化配置商品详情的图片的host
})
