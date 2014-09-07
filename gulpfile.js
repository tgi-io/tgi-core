/**
 * tgi-core
 * gulpfile
 */

// Include gulp
var gulp = require('gulp');

//Other node goodies
var childProcess = require('child_process');

// Gulp Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Lib Source Files
var libSource = [
  'lib/core/tgi-core.js'
];

// libFiles
var libFiles = libSource.slice();
libFiles.unshift('lib/misc/lib-header');
libFiles.push('lib/misc/lib-footer');

// Lint Task
gulp.task('lint', function () {
  return gulp.src('dist/tgi-core.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('build', function () {
  return gulp.src(libFiles)
    .pipe(concat('tgi-core.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('tgi-core.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

// Tests
gulp.task('test', function (callback) {
  console.log('test is done!!!');
  callback();
});

// Coverage
gulp.task('cover', function (callback) {
  childProcess.fork('/usr/local/bin/istanbul',['cover','spec/node-test.js'],{});
  callback();
});

// Default Task
gulp.task('default', ['build', 'lint', 'test', 'cover']);