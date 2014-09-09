/**
 * tgi-core
 * gulp-test
 */


module.exports = function (callback) {

  var tgi = require('../dist/tgi.core');
  var runner = require('./test-runner');

  // runner(tgi, callback);

  runner(tgi, function (msg) {
    if (msg.error) {
      console.error(msg.error);
      callback(Error(msg.error));
    } else if (msg.done) {
      console.log('--------------------------------');
      console.log('Testing completed with no errors');
      console.log('--------------------------------');
      callback();
    } else if (msg.log) {
      console.log(msg.log);
    }
  });




};


