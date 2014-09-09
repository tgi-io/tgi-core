/**
 * tgi-core
 * node-test
 */

var tgi = require('../dist/tgi.core');
var runner = require('./test-runner');

//runner(tgi, function(error){
//  var results = 'OK';
//  if (error)
//    results = error;
//  console.log('Test results...');
//  console.log(results);
//  if (error)
//    process.exit(1);
//});

runner(tgi, function (msg) {
  if (msg.error) {
    console.error(msg.error);
    process.exit(1);
  } else if (msg.done) {
    console.log('--------------------------------');
    console.log('Testing completed with no errors');
    console.log('--------------------------------');
  } else if (msg.log) {
    console.log(msg.log);
  }
});