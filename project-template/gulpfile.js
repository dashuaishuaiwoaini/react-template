var gulp = require('gulp')
var zip = require('gulp-zip')
var path = require('path')
var clean = require('gulp-clean')
var replace = require('gulp-replace')
// var gulpSequence = require('gulp-sequence')

var siteName = path.basename(__dirname)
var cdnName = 'za-static-cdn'
var cdnPath = path.resolve(__dirname, cdnName, siteName)
var packager = require('./package.json')

function getSrcRootPath () {
  return '.'
}

function getDistPath () {
  var distPath = './dist/' + siteName
  return distPath
}

function getPublickPath () {
  var env = process.env.BUILD_ENV // 需要在用到的命名前面加上  cross-env BUILD_ENV=prd

  var productLine = packager['product-line'] || 'if' // if life bank
  var hostMap = {
    sit: 'cdn.zatech.com',
    prd: 'cdn.za.group'
  }
  var cdnHost = hostMap[env]
  var siteName = path.basename(__dirname)
  let publicPath = ''
  if (env) {
    publicPath = 'https://' + cdnHost + '/' + productLine + '/' + siteName
  }
  console.log('cdnPath:', publicPath)
  return publicPath
}

var distPath = getDistPath()

// 删除
gulp.task('clean', function () {
  var cleanPath = [distPath, cdnPath]
  return gulp.src(cleanPath).pipe(clean())
})

gulp.task('cleanHtml', function () {
  var cleanPath = [cdnPath + '/home.html', cdnPath + '/home-dev.html']
  return gulp.src(cleanPath).pipe(clean())
})

gulp.task('cleanBuild', function () { // 清除打包后的代码，让git变得干净
  var srcRootPath = getSrcRootPath()
  var cleanPath = [cdnPath, distPath, srcRootPath + '/public/*.css', srcRootPath + '/public/*.js', srcRootPath + '/public/home.html']
  return gulp.src(cleanPath).pipe(clean())
})

// 迁移
gulp.task('move', ['clean'], function () {
  var srcRootPath = getSrcRootPath()
  gulp.src([srcRootPath + '/config/**']).pipe(gulp.dest(distPath + '/config'))
  gulp.src([srcRootPath + '/public/home.html']).pipe(gulp.dest(distPath + '/public'))
  gulp.src([srcRootPath + '/public/**']).pipe(gulp.dest(cdnPath))
  gulp.src([srcRootPath + '/server/**']).pipe(gulp.dest(distPath + '/server'))
  gulp.src([srcRootPath + '/src/**']).pipe(gulp.dest(distPath + '/src'))
  return gulp.src([
    srcRootPath + '/package.json',
    srcRootPath + '/package-lock.json',
    srcRootPath + '/server.js',
    srcRootPath + '/pm2.json',
    srcRootPath + '/startup.sh'
  ]).pipe(gulp.dest(distPath))
})

// 打zip包
gulp.task('zip', function () {
  return gulp.src(distPath + '**/**')
    .pipe(zip(siteName + '.zip'))
    .pipe(gulp.dest(path.dirname(distPath)))
})

gulp.task('replace', function () {
  var cdnUrl = getPublickPath()
  gulp.src(cdnPath + '/*.css')
    .pipe(replace(/\(\s*\/assets\//gi, '(' + cdnUrl + '/assets/'))
    .pipe(gulp.dest(cdnPath))

  gulp.src(distPath + '/src/sass/common/_variable.scss')
    .pipe(replace(/\$imghost\s*:\s*""/i, '$imghost:"' + cdnUrl + '"'))
    .pipe(gulp.dest(distPath + '/src/sass/common/'))

  gulp.src(distPath + '/server/app.js')
    .pipe(replace(/global\.__cdnpath\s*=\s*''/i, "global.__cdnpath = '" + cdnUrl + "'"))
    .pipe(gulp.dest(distPath + '/server'))
})
gulp.task('default', ['move'])
