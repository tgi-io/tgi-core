/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/spec/gulp-test.js
 **/
module.exports = function (callback) {
  var tgi = require('../dist/tgi.core');
  var testTGI = require('../dist/tgi.core-test');
  var runner = testTGI().runner;
  runner(testTGI, tgi, function (msg) {
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