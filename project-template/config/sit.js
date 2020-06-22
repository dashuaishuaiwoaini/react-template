var common = require('./common')
module.exports = Object.assign({}, common.config, {
  'env': 'test',
  'redisConfig': {

  },
  'sessionConfig': Object.assign({}, common.sessionConfig, {
    'domain': '.zatech.com'
  }),
  'i18nHost': 'yfyb-anan-anan-i18n.huawei-gz.net',
  'ajaxHost': 'yfyb-anan-anan-website.huawei-gz.net',
  'staticResHost': 'anan-pub-obs.obs.cn-south-1.myhuaweicloud.com'
})
