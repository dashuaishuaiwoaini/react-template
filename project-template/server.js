require('babel-polyfill')
require('babel-register')({
  presets: [ 'env', 'latest', 'stage-0', 'react' ],
  plugins: ['add-module-exports'],
  ignore: function (filename) {
    if (filename.indexOf('rc-cascader/node_modules/array-tree-filter') > -1) {
      return false
    } else if (filename.indexOf('node_modules') > -1) {
      return true
    } else {
      return false
    }
  }
})
// css 的转码 hook
require('css-modules-require-hook')({
  extensions: ['.scss', '.css'],
  preprocessCss: (data, filename) =>
    require('node-sass').renderSync({
      data,
      file: filename
    }).css,
  camelCase: true,
  generateScopedName: '[name]__[local]__[hash:base64:8]'
})

require('asset-require-hook')({ // 处理图片
  extensions: ['png', 'jpg', 'gif', 'svg']
})

require('./server/app')
