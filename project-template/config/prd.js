var common = require('./common')
module.exports = Object.assign({}, common.config, {
  'env': 'prd',
  'redisConfig': {

  },
  'sessionConfig': Object.assign({}, common.sessionConfig, {
    'domain': '.zatech.com'
  }),
  'i18nHost': 'common-anan-i18n-uat.pre.anan.net',
  'ajaxHost': 'policy-anan-website-uat.pre.anan.net',
  'staticResHost': 'anan-uat-obs-graphenepub.zatech.com'
})
