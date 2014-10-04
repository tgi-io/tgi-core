/**
 * tgi-core
 * node-test
 */

var tgi = require('../dist/tgi.core');
var testTGI = require('../dist/tgi.core-test');
var runner = testTGI().loadTests;

runner(testTGI, tgi, function (msg) {
  if (msg.error) {
    console.error(msg.error);
    process.exit(1);
  } else if (msg.done) {
    console.log('--------------------------------');
    console.log('Testing completed with no errors');
    console.log('--------------------------------');
  } else if (msg.log) {
    // console.log(msg.log);
  }
});