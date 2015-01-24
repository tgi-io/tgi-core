/**---------------------------------------------------------------------------------------------------------------------
 * tgi-spec/spec/node-runner.js
 */
var Spec = require('tgi-spec/dist/tgi.spec.js');
var testSpec = require('../dist/tgi.core.spec');
var TGI = require('../dist/tgi.core');
var _package = require('../package');

if (_package.version != TGI.CORE().version) {
  console.error('Library version %s does not match package.json %s',TGI.CORE().version,_package.version);
  process.exit(1);
}

var spec = new Spec();
testSpec(spec, TGI);
spec.runTests(function (msg) {
  if (msg.error) {
    console.error(msg.error);
    process.exit(1);
  } else if (msg.done) {
    console.log(msg.testsCreated + ' tests passed.');
    if (msg.testsPending)
      console.log(msg.testsPending + ' tests pending.');
    if (msg.testsFailed)
      console.log(msg.testsFailed + ' tests failed.');
    if (msg.testsFailed || msg.testsPending)
      process.exit(1);
  } else if (msg.log) {
    //console.log(msg.log);
  }
});
