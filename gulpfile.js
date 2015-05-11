'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var http = require('http');
var ecstatic = require('ecstatic');
var runSequence = require('run-sequence');
var del = require('del');

gulp.task('clean', function(){
  del([
    '.tmp',
    'dist/*',
    '!dist/.git'
  ], function(err, deletedFiles) {
    console.log('Files deleted: ', deletedFiles.join(', '));
  });
});

// Styles
gulp.task('styles', function() {
  return gulp.src('src/sass/**/*')
    .pipe($.plumber({errorHandler: $.notify.onError("SASS Error: <%= error.message %>")}))
    .pipe($.rubySass({
      'sourcemap=none': true,
      style: 'expanded',
      noCache: true
    }))
    .pipe($.autoprefixer('last 3 versions'))
    .pipe($.minifyCss())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/styles'))
    .pipe($.size());
});

gulp.task('clientApp', function() {
  return gulp.src(['src/scripts/user/App.jsx'])
    .pipe($.plumber({
      errorHandler: $.notify.onError('Browserify Error: <%= error.message %>')
    }))
    .pipe($.browserify({
      noparse: ['react/addons', 'kefir', 'lodash'],
      transform: 'reactify',
      extensions: ['.jsx']
    }))
    .pipe($.concat('clientApp.js'))
    .pipe(gulp.dest('dist/scripts'));
});

// HTML
gulp.task('html', function() {
  return gulp.src('src/*.html')
  .pipe($.useref())
  .pipe(gulp.dest('dist'))
  .pipe($.size());
  });

// Images
gulp.task('images', function() {
  return gulp.src('src/images/**/*.{jpg,png}')
  .pipe($.cache($.imagemin({
    optimizationLevel: 3,
    progressive: true,
    interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
  .pipe($.size());
  });

gulp.task('serve', function() {
  http.createServer(ecstatic({root: 'dist'})).listen(8080);
});

gulp.task('default', ['clean'], function(callback) {
  runSequence('styles', ['clientApp', 'html', 'images', 'serve'], callback);
});

gulp.task('watch', ['default'], function() {
  gulp.watch('src/sass/**/*.sass', ['styles']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch(['src/**/*.js', 'src/**/*.jsx'], ['clientApp']);
  gulp.watch('src/images', ['images']);
});
