#! /usr/bin/env node

var fs = require('fs')
var path = require('path')

var args = process.argv
var command = (args[2]) ? args[2].toLowerCase() : ''

switch (command) {
  case '-v':
    showVersion()
    break
  case 'init':
    initAction()
    break
  case '-h':
  case 'help':
    showHelp()
    break
  default :
    showDescribe()
}

function initAction () {
  var foldName = args[3] || 'project-template'
  let targetDir = process.cwd() + '/' + foldName + '/'
  let sourceDir = path.join(__dirname, 'project-template') + '/'
  copyFolder(targetDir, sourceDir)
  console.log('空项目模板生成成功！')
  console.log('请查看当前目录下' + foldName + '文件夹')
}

function showVersion () {
  let data = fs.readFileSync(path.join(__dirname, 'package.json')).toString()
  data = JSON.parse(data)
  console.log(data.version)
}

function showHelp () {
  console.log('zati-react init [folderName] ------  在当前目录生成空项目模板,folderName的值默认为project-template')
  console.log('zati-react -v   ------  显示当前版本')
  console.log('zati-react -h   ------  显示帮助说明')
  console.log('zati-react      ------  显示说明文档')
}

function showDescribe () {
  let data = fs.readFileSync(path.join(__dirname, 'README.md')).toString()
  console.log(data)
}

function copyFolder (targetDir, sourceDir) { // 复制文件夹及里面的文件
  let exists = fs.existsSync(targetDir)
  let state
  let source
  let target

  if (!exists) {
    fs.mkdirSync(targetDir)
  }
  if (fs.existsSync(sourceDir)) {
    fs.readdir(sourceDir, function (err, files) {
      if (err) {
        console.log('readdirError(复制文件时出错):' + err)
        process.exit(309)
      }
      for (var i = 0; i < files.length; i += 1) {
        state = fs.statSync(sourceDir + files[i])
        if (state.isDirectory() && files[i] !== '.svn') {
          target = targetDir
          source = sourceDir
          target = target + files[i] + '/'
          source = source + files[i] + '/'
          copyFolder(target, source)
        } else if (state.isFile()) {
          if (/(.jpg|.png|.gif|.jpeg|.bmp)$/ig.test(files[i])) {
            var targetStream = fs.createWriteStream(targetDir + files[i])
            var sourceStream = fs.createReadStream(sourceDir + files[i])
            sourceStream.pipe(targetStream)
          } else {
            fs.writeFileSync(targetDir + files[i], fs.readFileSync(sourceDir + files[i]).toString())
          }
        }
      }
    })
  }
}
