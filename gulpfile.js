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
  'lib/core/tgi-core-message.source.js',
  'lib/core/tgi-core-model.source.js',
  'lib/core/tgi-core-procedure.source.js',
  'lib/core/tgi-core-request.source.js',
  'lib/core/tgi-core-store.source.js',
  'lib/core/tgi-core-text.source.js',
  'lib/core/tgi-core-transport.source.js',
  'lib/core/tgi-core-view.source.js',
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
  'lib/core/tgi-core-text.spec.js',
  'lib/core/tgi-core-transport.spec.js',
  'lib/core/tgi-core-view.spec.js',
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
function _buildLibQuick() {
  return gulp.src(libPackaging)
    .pipe(concat('tgi.core.js'))
    .pipe(gulp.dest('dist'));
}
function _buildSpecQuick() {
  return gulp.src(specPackaging)
    .pipe(concat('tgi.core.spec.js'))
    .pipe(gulp.dest('dist'));
}
const _buildQuick = gulp.parallel(_buildLibQuick, _buildSpecQuick);

// Build Lib
function _buildLib() {
  return gulp.src(libPackaging)
    .pipe(concat('tgi.core.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('tgi.core.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
}
// Build Lib Chunk
function _buildLibChunk() {
  return gulp.src(libFiles)
    .pipe(concat('tgi.core.chunk.js'))
    .pipe(gulp.dest('dist'));
}
// Build Spec
function _buildSpec() {
  return gulp.src(specPackaging)
    .pipe(concat('tgi.core.spec.js'))
    .pipe(gulp.dest('dist'));
}
// Build Spec Chunk
function _buildSpecChunk() {
  return gulp.src(specFiles)
    .pipe(concat('tgi.core.spec.chunk.js'))
    .pipe(gulp.dest('dist'));
}
const build = gulp.series(
  gulp.parallel(_buildLibChunk, _buildLib, _buildSpecChunk, _buildSpec)
);

// Lint Lib
function _lintLib() {
  return gulp.src('dist/tgi.core.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
}
// Lint Spec
function _lintSpec() {
  return gulp.src('dist/tgi.core.spec.js')
    .pipe(jshint({validthis: true, sub: true}))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
}
const lint = gulp.series(
  gulp.parallel(
    gulp.series(_buildLibChunk, _buildLib, _lintLib),
    gulp.series(_buildSpecChunk, _buildSpec, _lintSpec)
  )
);

// Quick Test Task
function quickTest(cb) {
  _buildQuick(function() {
    childProcess.exec('node spec/node-runner.js', function (error, stdout, stderr) {
      console.log(stdout);
      console.error(stderr);
      cb(error);
    });
  });
}
// Test Task
function test(cb) {
  lint(function() {
    childProcess.exec('node spec/node-runner.js', function (error, stdout, stderr) {
      console.log(stdout);
      cb(error);
    });
  });
}
// Coverage Task
function cover(cb) {
  childProcess.exec('istanbul cover spec/node-runner.js', function (error, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);
    cb(error);
  });
}
// Spec Task
function spec(cb) {
  lint(function() {
    setTimeout(function () {
      childProcess.exec('node spec/node-make-spec-md.js', function (error, stdout, stderr) {
        console.log(stdout);
        cb(error);
      });
    }, 100);
  });
}

exports._buildLibQuick = _buildLibQuick;
exports._buildSpecQuick = _buildSpecQuick;
exports._buildQuick = _buildQuick;
exports._buildLib = _buildLib;
exports._buildLibChunk = _buildLibChunk;
exports._buildSpec = _buildSpec;
exports._buildSpecChunk = _buildSpecChunk;
exports.build = build;
exports._lintLib = _lintLib;
exports._lintSpec = _lintSpec;
exports.lint = lint;
exports.quickTest = quickTest;
exports.test = test;
exports.cover = cover;
exports.spec = spec;
exports.default = test;
exports.travis = test;
