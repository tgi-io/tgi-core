/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/gulpfile.js
 */

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var childProcess = require('child_process');

// Source and _packaging
var libFiles = [
  'lib/tgi-core.source.js',
  'lib/core/tgi-core-attribute.source.js',
  'lib/core/tgi-core-command.source.js',
  'lib/core/tgi-core-delta.source.js',
  'lib/core/tgi-core-interface.source.js',
  'lib/core/tgi-core-list.source.js',
  'lib/core/tgi-core-model.source.js',
  'lib/core/tgi-core-message.source.js',
  'lib/core/tgi-core-procedure.source.js',
  'lib/core/tgi-core-request.source.js',
  'lib/core/tgi-core-store.source.js',
  'lib/core/tgi-core-transport.source.js',
  'lib/core/tgi-core-model.source.js',
  'lib/core/tgi-core-model.source.js',
  'lib/interfaces/tgi-core-interfaces-repl.source.js',
  'lib/models/tgi-core-model-application.source.js',
  'lib/models/tgi-core-model-log.source.js',
  'lib/models/tgi-core-model-presentation.source.js',
  'lib/models/tgi-core-model-session.source.js',
  'lib/models/tgi-core-model-user.source.js',
  'lib/models/tgi-core-model-workspace.source.js',
  'lib/stores/tgi-core-store-memory.source.js',
  'lib/utility/tgi-core-arrays.source.js',
  'lib/utility/tgi-core-objects.source.js',
  'lib/utility/tgi-core-strings.source.js'
];
var libPackaging = ['lib/_packaging/lib-header'].concat(libFiles).concat(['lib/_packaging/lib-footer']);

// The Spec
var specFiles = [
  'lib/tgi-core.spec.js',
  'lib/core/tgi-core-attribute.spec.js',
  'lib/core/tgi-core-command.spec.js',
  'lib/core/tgi-core-delta.spec.js',
  'lib/core/tgi-core-interface.spec.js',
  'lib/core/tgi-core-list.spec.js',
  'lib/core/tgi-core-message.spec.js',
  'lib/core/tgi-core-model.spec.js',
  'lib/core/tgi-core-procedure.spec.js',
  'lib/core/tgi-core-request.spec.js',
  'lib/core/tgi-core-store.spec.js',
  'lib/core/tgi-core-transport.spec.js',
  'lib/interfaces/tgi-core-interfaces-repl.spec.js',
  'lib/models/tgi-core-model-application.spec.js',
  'lib/models/tgi-core-model-log.spec.js',
  'lib/models/tgi-core-model-presentation.spec.js',
  'lib/models/tgi-core-model-session.spec.js',
  'lib/models/tgi-core-model-user.spec.js',
  'lib/models/tgi-core-model-workspace.spec.js',
  'lib/stores/tgi-core-store-memory.spec.js',
  'lib/utility/tgi-core-arrays.spec.js',
  'lib/utility/tgi-core-objects.spec.js',
  'lib/utility/tgi-core-strings.spec.js'
];
var specPackaging = ['lib/_packaging/spec-header'].concat(specFiles).concat(['lib/_packaging/spec-footer']);

// Build Quick (for test)
gulp.task('_buildLibQuick', function () {
  return gulp.src(libPackaging)
    .pipe(concat('tgi.core.js'))
    .pipe(gulp.dest('dist'))
});
gulp.task('_buildSpecQuick', function () {
  return gulp.src(specPackaging)
    .pipe(concat('tgi.core.spec.js'))
    .pipe(gulp.dest('dist'))
});
gulp.task('_buildQuick',  ['_buildLibQuick', '_buildSpecQuick'], function (callback) {
  callback();
});

// Build Lib
gulp.task('_buildLib', function () {
  return gulp.src(libPackaging)
    .pipe(concat('tgi.core.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('tgi.core.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

// Build Lib Chunk
gulp.task('_buildLibChunk', function () {
  return gulp.src(libFiles)
    .pipe(concat('tgi.core.chunk.js'))
    .pipe(gulp.dest('dist'));
});

// Build Spec
gulp.task('_buildSpec', function () {
  return gulp.src(specPackaging)
    .pipe(concat('tgi.core.spec.js'))
    .pipe(gulp.dest('dist'));
});

// Build Spec Chunk
gulp.task('_buildSpecChunk', function () {
  return gulp.src(specFiles)
    .pipe(concat('tgi.core.spec.chunk.js'))
    .pipe(gulp.dest('dist'));
});

// Build Task
gulp.task('build', ['_buildLibChunk', '_buildLib', '_buildSpecChunk', '_buildSpec'], function (callback) {
  callback();
});

// Lint Lib
gulp.task('_lintLib', ['_buildLibChunk', '_buildLib'], function (callback) {
  return gulp.src('dist/tgi.core.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

// Lint Spec
gulp.task('_lintSpec', ['_buildSpecChunk', '_buildSpec'], function (callback) {
  return gulp.src('dist/tgi.core.spec.js')
    .pipe(jshint({validthis: true, sub: true}))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

// Lint Task
gulp.task('lint', ['_lintLib', '_lintSpec'], function (callback) {
  callback();
});

// Quick Test Task
gulp.task('quickTest', ['_buildQuick'], function (callback) {
  childProcess.exec('node spec/node-runner.js', function (error, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);
    callback(error);
  });
});

// Test Task
gulp.task('test', ['lint'], function (callback) {
  childProcess.exec('node spec/node-runner.js', function (error, stdout, stderr) {
    console.log(stdout);
    callback(error);
  });
});

// Coverage Task
gulp.task('cover', function (callback) {
  childProcess.exec('istanbul cover spec/node-runner.js', function (error, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);
    callback(error);
  });
});

// Spec Task
gulp.task('spec', ['lint'], function (callback) {
  setTimeout(function () {
    childProcess.exec('node spec/node-make-spec-md.js', function (error, stdout, stderr) {
      console.log(stdout);
      callback(error);
    });
  }, 100); // Without this sometimes the exec runs before script is written/flushed ?
});

// Default & Travis CI Task
gulp.task('default', ['test']);
gulp.task('travis', ['test']);
