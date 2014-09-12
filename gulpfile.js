/**
 * tgi-core
 * gulpfile
 */

// Include gulp
var gulp = require('gulp');

//Other node goodies
var childProcess = require('child_process');
var fs = require('fs');

// Gulp Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Create list of files for lib and tests
var sources = JSON.parse(fs.readFileSync('data/lib.json', 'utf8')).sources;
var libFiles = ['lib/misc/lib-header'];
var testFiles = ['lib/misc/test-header'];
testFiles.push('lib/test/tgi-test.js');
testFiles.push('lib/test/tgi-test-bootstrap.js');
testFiles.push('lib/test/tgi-test-runner.js');
for (var i = 0; i < sources.length; i++) {
  var source = sources[i];
  for (var j = 0; j < source.files.length; j++) {
    var file = source.files[j];
    var sourceFile = 'lib/' + source.folder + '/' + file + '.source.js';
    var testFile = 'lib/' + source.folder + '/' + file + '.test.js';
    console.log(sourceFile + ' ' + testFile);
  if (!fs.existsSync(sourceFile)) {
    throw 'cannot find source file: ' + sourceFile;
  }
  if (!fs.existsSync(testFile)) {
    throw 'cannot find test source file: ' + testFile;
  }
  libFiles.push(sourceFile);
  testFiles.push(testFile);
  }
}
libFiles.push('lib/misc/lib-footer');
testFiles.push('lib/misc/test-footer');

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
  gulp.src(testFiles)
    .pipe(concat('tgi.core-test.js'))
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
