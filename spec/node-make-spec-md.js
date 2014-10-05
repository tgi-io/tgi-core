/**---------------------------------------------------------------------------------------------------------------------
 * tgi-spec/spec/node-runner.js
 */
var Spec = require('tgi-spec/dist/tgi.spec.js');
var testSpec = require('../dist/tgi.core.spec');
var spec = new Spec();
var fs = require('fs');
var CORE = require('../dist/tgi.core');

(function () {
  CORE().injectMethods(this);
  // this.inheritPrototype = CORE().inheritPrototype;
  testSpec(spec, CORE);
  spec.runTests(function (msg) {
    if (msg.error) {
      console.error(msg.error);
      process.exit(1);
    } else if (msg.done) {
      console.log('Testing completed with  ...');
      console.log('testsCreated = ' + msg.testsCreated);
      console.log('testsPending = ' + msg.testsPending);
      console.log('testsFailed = ' + msg.testsFailed);
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
}());


