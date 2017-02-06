// plugin  var
var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    bower = require('gulp-bower'),
    connect = require('gulp-connect-php'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    gulpPlumber = require('gulp-plumber');

// common
var reload      = browserSync.reload;

//path

// var web = {
//     scripts: 'resources/assets/js/*.js',
//     images: 'resources/assets/images/*',
//     fonts: ['resources/assets/fonts/*', 'resources/assets/fonts/**/*'],
//     sass: [
//         'resources/assets/sass/*.scss',
//         'resources/assets/sass/views/vender/**/*.scss'
//     ],
//     tmp: 'resources/assets/tmp/css/*.css'
// };

//php
gulp.task('php', function() {
    connect.server({
        base: './',
        keepalive: true,
        port: 8080,
        open: false
    });
});


gulp.task('css',function(){
  var plugins = [
    autoprefixer ({broswer : ['last 1 vrsion']})
  ];
   return gulp.src('./css/*.css')
   .pipe(postcss(plugins))
   .pipe(gulp.dest('./css/finish'));
});



//bower
gulp.task('bower', function() {
    return bower('./bower_components')
        .pipe(gulpPlumber())
        .pipe(gulp.dest('libs/'))
});

//  sass
gulp.task('styles', function() {
    gulp.src('sass/*.scss') //要處理的scss檔案
        //  .pipe(gulpPlumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({
            outputStyle: 'expanded' // compact , expanded, nested
        }))
        .pipe(gulp.dest('css')) //指定編譯後的路徑

});


//broswerSync server
gulp.task('server', ['php'], function() {
    browserSync.init({
        injectChanges: true,
        proxy: '127.0.0.1:8080',
        port: 8888,
        open: true
    });
    gulp.watch('sass/*.scss', ['styles']).on('change', reload); //watch  sass
    gulp.watch('*.html').on('change', reload); //watch html
    gulp.watch('css/*.css', ['css']).on('change', reload); //watch  sass
    gulp.watch('./bower_components', ['bower']); //watch html
    gulp.watch('*.php').on('change', function () {
    browserSync.reload();
    });
});

//broswerSync static
gulp.task('static', ['styles'], function() {
    browserSync.init({
      server: {
          baseDir: "./"
      }
    });
    gulp.watch('sass/*.scss', ['styles']).on('change', reload); //watch  sass
    gulp.watch('css/*.css', ['css']).on('change', reload); //watch  sass
    gulp.watch('*.html').on('change', reload); //watch html
    gulp.watch('./bower_components', ['bower']); //watch html
});


gulp.task('online', ['server']);
// gulp.task('online', ['serve' , 'bower']);

gulp.task('default', ['static']);
