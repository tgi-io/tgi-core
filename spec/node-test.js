/**
 * tgi-core
 * node-test
 */

var tgi = require('../dist/tgi.core');
var runner = require('./test-runner');

runner(tgi, function(error){
  var results = 'OK';
  if (error)
    results = error;
  console.log('Test results...');
  console.log(results);
  if (error)
    process.exit(1);
});
