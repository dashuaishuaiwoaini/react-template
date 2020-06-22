
let env = process.env.DEPLOY_ENV || process.env.NODE_ENV || 'develop'

let configMap = {
  develop: require('./dev.js'), // 本地开发环境
  dev: require('./dev.js'), // 容器云开发环境
  sit: require('./sit.js'), // 容器云测试线 SIT
  pre: require('./uat.js'), // 容器云uat环境  UAT
  uat: require('./uat.js'), // 容器云uat环境  UAT
  prd: require('./prd.js'), // 容器云正式环境
  production: require('./prd.js') // 用env.node_evn为环境变量的服务器的正式环境
}

module.exports = configMap[env]
