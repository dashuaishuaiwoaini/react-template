module.exports = {
  config: {
    'port': 8080,
    'developMode': process.env.NODE_ENV === 'develop',
    'sessionKeys': {
      'userToken': 'USER_TOKEN_VPWBAVW',
      'userInfo': 'USER_INFO_BYPPNZM',
      'securecode': 'SECURE_CODE_XTFKBHG'
    },
    needRedis: false
  },
  sessionConfig: {
    'name': 'nodejs_sid_temp', // sessionId的key值   新应用需更改为最新的，避免重复
    'secret': 'zati-core'
  }

}
