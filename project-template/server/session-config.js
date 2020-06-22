var session = require('express-session')
var redis = require('redis')
var RedisStore = require('connect-redis')(session)
var config = require('../config')

var sessionObj = {
  key: config.sessionConfig.name,
  name: config.sessionConfig.name,
  secret: config.sessionConfig.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    // secure: false, // true表示https
    // maxAge: 6 * 60 * 60 * 1000, // 有效期6个小时
    domain: config.sessionConfig.domain
  }
}

if (config.needRedis) {
// 创建Redis客户端
  var redisClient = redis.createClient(config.redisConfig.port, config.redisConfig.redisHost)
  var redisOption = {
    client: redisClient,
    secret: 'anan-adskfjkwe'
  }

  redisClient.auth(config.redisConfig.password, function () {
    console.log('redis通过认证...')
  })

  redisClient.on('ready', function (err) {
    if (err) {
      console.log('ready err : ' + err)
    } else {
      console.log('redis ready... ')
    }
  })

  redisClient.on('error', function (err) {
    console.log('RedisClient Error ' + err)// 用于提示错误信息
  })

  sessionObj.store = new RedisStore(redisOption)
}

module.exports = session(sessionObj)
