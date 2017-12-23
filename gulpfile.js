var gulp = require('gulp');
var uglify = require('gulp-uglify');//压缩js
var concat = require('gulp-concat');//合并js，css
var sass = require('gulp-sass');//编译sass
var minify = require('gulp-minify-css');//压缩css
var autoprefixer = require('gulp-autoprefixer');//补全css前缀
var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean');
var connect = require('gulp-connect');
var watch = require('gulp-watch');


// css，编译scss，补全前缀，压缩，合并
gulp.task('styles', function() {
  gulp.src('./public/stylesheets/sass/**/*.scss')
      .pipe(sass().on('error', function(err) {
          console.log(err.toString())
      }))
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
      .pipe(minify())
      .pipe(concat('layout.css'))
      .pipe(gulp.dest('./public/stylesheets'))
});

// 运行服务
gulp.task('connect', function() {
  connect.server({
    root: './',
    port: '3001',
    livereload: true
  });
});

// 清空删除dist
gulp.task('clean', function () {
  gulp.src('./dist/')
      .pipe(clean({
        force: true
      }))
});

// 监听文件变化
gulp.task('watch', function() {
  gulp.watch('public/stylesheets/sass/**/*.scss', ['styles']);
});

gulp.task('server', ['watch', 'connect']);