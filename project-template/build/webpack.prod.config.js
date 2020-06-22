var webpack = require('webpack')
var base = require('./webpack.base.config.js')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var ProgressBarPlugin = require('progress-bar-webpack-plugin')
var chalk = require('chalk')
var merge = require('webpack-merge')
var packager = require('../package.json')
var theme = packager.theme
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var path = require('path')
require('babel-polyfill')

function getPublickPath () {
  var env = process.env.BUILD_ENV
  var productLine = packager['product-line'] || 'if' // if life bank
  var hostMap = {
    sit: 'cdn.zatech.com',
    prd: 'cdn.za.group'
  }
  var cdnHost = hostMap[env]
  var siteName = path.basename(path.dirname(__dirname))
  let publicPath = ''
  if (env) {
    publicPath = 'https://' + cdnHost + '/' + productLine + '/' + siteName
  }
  console.log('cdnPath:', publicPath)
  return publicPath
}
var publicPath = getPublickPath()

module.exports = merge({
  mode: 'production',
  entry: {
    app: [
      'babel-polyfill', // 线上优化的话可以采用cdn的方式，节省内存
      base.srcPath + '/index.js'
    ]
    // 提取公共的js文件
    // vendor: ['react', 'react-dom', 'mirrorx', 'react-intl', 'intl', base.srcPath + '/lib/iconfont.js']
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash:5].js',
    path: base.staticPath,
    publicPath: publicPath + '/' // 服务器部署路径
  },
  optimization: {
    noEmitOnErrors: true,
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      chunks: 'initial', // async   initial
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        'vendors': {
          test: chunk => (
            chunk.resource &&
            /\.js$/.test(chunk.resource) &&
            /node_modules/.test(chunk.resource)
          ),
          name: 'vendors',
          chunks: 'all',
          priority: 1
        },
        'common-vendors': {
          name: 'common-vendors',
          test: module => /react|react-dom|react-intl|mirrorx|intl/.test(module.context),
          // chunks: 'initial',
          priority: 2
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },

    minimizer: [
      new UglifyJsPlugin({
        exclude: /\.min\.js$/, // 过滤掉以".min.js"结尾的文件，我们认为这个后缀本身就是已经压缩好的代码，没必要进行二次压缩
        cache: true,
        parallel: true, // 开启并行压缩，充分利用cpu
        sourceMap: false,
        extractComments: false, // 移除注释
        uglifyOptions: {
          compress: {
            unused: true,
            warnings: false,
            drop_console: true,
            drop_debugger: true
          },
          output: {
            comments: false
          }
        }
      })
    ]
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules|bower_components/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'stage-0', 'react'],
            plugins: [
              ['react-hot-loader/babel'],
              ['import', { 'libraryName': 'antd', 'style': true }]
            ]
          }
        }
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['env', {
                  modules: false,
                  targets: {
                    browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 9']
                  }
                }], 'react', 'stage-0'
              ],
              plugins: ['transform-runtime']
            }
          },
          {
            loader: 'awesome-typescript-loader'
          }
        ]
      },

      {
        test: /\.css$/,
        loader: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', { loader: 'less-loader', options: { javascriptEnabled: true, modifyVars: theme } }],
        include: /node_modules/
      },
      {
        test: /\.(sass|scss)$/,
        include: [base.srcPath],
        exclude: [base.libPath],
        use: [MiniCssExtractPlugin.loader, 'thread-loader', 'css-loader', 'postcss-loader', 'sass-loader', {
          loader: 'sass-resources-loader',
          options: {
            resources: [
              // resolve方法第二个参数为scss配置文件地址，如果有多个，就进行依次添加即可
              path.resolve(__dirname, '../src/sass/common/_variable.scss')
            ]
          }
        }]
      }
    ]
  },
  plugins: [
    // 压缩提取的css
    new OptimizeCSSPlugin(),
    // 变量提升插件
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NamedChunksPlugin(),
    // 打包进度插件
    new ProgressBarPlugin({
      format: chalk.red.bold('开始打包') + ' build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new HtmlWebpackPlugin({
      cdnpath: publicPath,
      hash: false,
      inject: 'body',
      filename: 'home.html',
      template: base.srcPath + '/template.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: false
      }
    }),
    // css分离插件
    new MiniCssExtractPlugin({
      filename: 'index.css',
      chunkFilename: '[id].[hash].css'
    })
  ]
}, base.config)
