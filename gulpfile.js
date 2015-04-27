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

gulp.task('browserify', function() {
  return gulp.src('src/scripts/app.jsx')
    .pipe($.plumber({errorHandler: $.notify.onError("Browserify Error: <%= error.message %>")}))
    .pipe($.browserify({
      noparse: ['react/addons', 'kefir', 'lodash'],
      transform: 'reactify',
      extensions: ['.jsx']
    }))
    // .pipe($.uglify())
    .pipe($.concat('app.js'))
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
  runSequence('styles', ['browserify', 'html', 'images', 'serve'], callback);
});

gulp.task('watch', ['default'], function() {
  gulp.watch('src/sass/**/*.sass', ['styles']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch(['src/**/*.js', 'src/**/*.jsx'], ['browserify']);
  gulp.watch('src/images', ['images']);
});

//
//
// // Webserver
// gulp.task('serve', function() {
//   gulp.src('dist')
//   .pipe($.webserver({
//     livereload: false,
//     port: 9000,
//     fallback: 'index.html'
//     }));
//   });
//
//
// // Testing
// gulp.task('jest', function() {
//   var nodeModules = path.resolve('./node_modules');
//   return gulp.src('src/scripts/**/__tests__')
//   .pipe($.jest({
//     scriptPreprocessor: nodeModules + '/gulp-jest/preprocessor.js',
//     unmockedModulePathPatterns: [nodeModules + '/react']
//     }));
//   });
//
//
// // Clean
// gulp.task('clean', function(cb) {
//   del(['dist/styles', 'dist/scripts', 'dist/images'], cb);
//   });
//
//
// // Default task
// gulp.task('default', ['clean', 'html', 'styles', 'images', 'scripts', 'jest']);
//
//
// // Watch
// gulp.task('watch', ['html', 'styles', 'images', 'scripts', 'serve'], function() {
//   gulp.watch('src/*.html', ['html']);
//   gulp.watch('src/styles/**/*.sass', ['styles']);
//   gulp.watch('src/images/**/*', ['images']);
//   });
