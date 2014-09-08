/**
 * tgi-core
 * gulp-test
 */


module.exports = function (callback) {

  var tgi = require('../dist/tgi.core');
  var runner = require('./test-runner');

  runner(tgi, callback);
};