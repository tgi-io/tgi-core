/**
 * tgi-core
 * gulpfile
 */

var fs = require('fs');

//// Lib Source Files
var libSource = JSON.parse(fs.readFileSync('json/lib.json', 'utf8')).path;

// Include gulp
var gulp = require('gulp');

//Other node goodies
var childProcess = require('child_process');

// Gulp Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// libFiles
var libFiles = libSource.slice();
libFiles.unshift('lib/misc/lib-header');
libFiles.push('lib/misc/lib-footer');

// Lint Task
gulp.task('lint', function () {
  return gulp.src('dist/tgi.core.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('build', function (callback) {
  gulp.src(libFiles)
    .pipe(concat('tgi.core.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('tgi.core.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
  callback();
});

// Tests
var testRunner = require('./spec/gulp-test');
gulp.task('test', function (callback) {
  testRunner(callback);
});

gulp.task('retest', ['build'], function (callback) {
  childProcess.exec('node spec/node-test.js', function (error, stdout, stderr) {
    console.log(stdout);
    callback(error);
  });
});

// phantomjs
gulp.task('phantomjs', function (callback) {
  // phantomjs spec/phantomjs-test.js
  callback(Error('EPIC FAIL!!!'));
});

// Coverage
gulp.task('cover', function (callback) {
  // todo find in path since fork fails me without it
  childProcess.fork('/usr/local/bin/istanbul', ['cover', 'spec/node-test.js'], {});
  callback();
});

// Travis
gulp.task('travis', ['build', 'lint', 'test']);

// Default Task
gulp.task('default', ['build', 'lint', 'cover']);

// Build & Retest
gulp.task('build & retest', ['build', 'retest']);
