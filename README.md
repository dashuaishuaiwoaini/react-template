### zati-react
React项目脚手架，定制化的空项目模板，集成项目所需通用解决方案，旨在简化项目搭建流程，同时积累项目搭建经验，不断加强项目的健壮性。
### Start
npm install -g zati-react


### Command Usage
>zati-react init [folderName]  —— 在当前目录生成空项目模板,folderName的值默认为project-template

>zati-react -v ——  显示当前版本

>zati-react  ——   显示说明文档

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

----
### 注意事项：
* 1、新建项目前，先更新zati-react包（npm update -g zati-react），再拉取代码。（脚手架本身可能有更新）
* 2、无用的代码和文件夹及文件可以删去
* 3、记得修改template.html里面的title，改成各项目独有的
* 4、记得修改config文件夹common.js里面的sessionConfig的name值，改成各项目独有的
* 5、记得把npm的registry切到https://npm.zhonganonline.com
* 6、如不需要CDN，那么只需执行npm run build即可，或者修改npm run product的配置，去掉gulp的相关执行

----
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

