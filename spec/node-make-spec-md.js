/**---------------------------------------------------------------------------------------------------------------------
 * tgi-spec/spec/node-runner.js
 */
var Spec = require('tgi-spec/dist/tgi.spec.js');
var testSpec = require('../dist/tgi.core.spec');
var fs = require('fs');
var CORE = require('../dist/tgi.core');

var spec = new Spec();
testSpec(spec, CORE);
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

    if (msg.testsFailed || msg.testsPending) {
      fs.writeFileSync('spec/README.md', spec.githubMarkdown(), 'utf8');
      process.exit(1);
    } else {
      fs.writeFileSync('spec/README.md', spec.githubMarkdown(), 'utf8');
    }
  } else if (msg.log) {
    //console.log(msg.log);
  }
});
