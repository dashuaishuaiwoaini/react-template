var webpack = require('webpack')
var base = require('./webpack.base.config.js')
var HtmlWebpackPlugin = require('html-webpack-plugin')
const { CheckerPlugin } = require('awesome-typescript-loader')
require('babel-polyfill')
var path = require('path')
var merge = require('webpack-merge')
var theme = require('../package.json').theme
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = merge({
  mode: 'development',
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    base.srcPath + '/index.js'
  ],
  output: {
    filename: 'app.js',
    chunkFilename: '[name].[chunkhash:5].min.js',
    path: base.staticPath,
    publicPath: '/' // 服务器部署路径
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
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
        enforce: 'pre', test: /\.js$/, loader: 'source-map-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        include: [base.srcPath],
        exclude: [base.libPath],
        use: ['style-loader', 'css-loader', 'sass-loader', {
          loader: 'sass-resources-loader',
          options: {
            resources: [
              // resolve方法第二个参数为scss配置文件地址，如果有多个，就进行依次添加即可
              path.resolve(__dirname, '../src/sass/common/_variable.scss')
            ]
          }
        }]
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', { loader: 'less-loader', options: { javascriptEnabled: true, modifyVars: theme } }],
        include: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      inject: 'body',
      filename: 'home-dev.html',
      template: base.srcPath + '/template.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CheckerPlugin()
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: 8889,
    //   reportFilename: 'report.html',
    //   defaultSizes: 'parsed',
    //   openAnalyzer: true,
    //   generateStatsFile: false,
    //   statsFilename: 'stats.json',
    //   statsOptions: null,
    //   logLevel: 'info'
    // })
  ],
  devtool: 'cheap-module-eval-source-map'
}, base.config)
