### 开发
* 1、npm install
* 2、npm start

### 开发环境打包
* npm run build
  
  ### 测试环境打包
* npm run sit
* 
### 正式环境打包
* npm run product

### 不需要CDN的情况
* 使用npm run build的配置，或者修改npm run product的配置，去掉gulp的相关执行


### 项目架构说明
- dockerfile为容器云发布的配置文件
- config为ajax地址的配置文件
- server为node端代码
- src为客户端代码，/src/api为api地址的汇总文件
- public为打包出来的静态文件的地址。

### 包含的相关技术
* React (Hooks)
* Nodejs
* Mirrorx
* TypeScript
* Webpack
* Gulp
* Sass
* Docker
* Pm2
* Antd
* Redis
* CDN

### 脚手架包含的内容：


#### 空项目模板
* 统一的项目目录
* 统一的入口文件
* 统一的代码打包方案（热更新、生产环境与开发环境代码隔离等）
* 统一的代码书写规范示例
* 统一的组件创建规范示例
* 统一的ajax请求规范示例（路径单独提取、前缀）
* 提取常用方法的工具库T.js
* Typescript使用示例
* React Hooks使用示例
* nodejs进程管理示例（pm2.js）
* 封装Redux的Mirrorx状态管理使用示例
* 代码提交规范检查校验

#### 公共解决方案
* 国际化引用方案
* 图片懒加载方案
* 服务端渲染方案
* 请求跨域方案
* Web安全防御方案


#### UI初始化
* UI框架主题色配置
* UI视觉规范设置（主色、辅色、默认字体及大小、按钮状态、字体图标、选中背景色）
* 公共样式
* 移动端适配方案
* 字体引入解决方案
* 加载中状态控制方案
* CSS3样式前缀自动补齐方案
