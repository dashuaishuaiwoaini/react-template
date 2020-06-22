var path = require('path')
/**
 * 项目的公共配置
 */

var config = {
  resolve: {
    alias: {
      component: path.resolve(__dirname, '../src/component'),
      sass: path.resolve(__dirname, '../src/sass')
    }
  }
}
module.exports = {
  staticPath: path.resolve(__dirname, '..', 'public'), // 导出地址
  outputPath: path.resolve(__dirname, 'app'), // 最终打包后发到线上的代码的地址
  rootPath: __dirname, // 项目根目录
  srcPath: path.resolve(__dirname, '..', 'src'),
  serverPath: path.resolve(__dirname, '..', 'server'),
  libPath: path.resolve(__dirname, '..', 'node_modules'),
  config: config
}
