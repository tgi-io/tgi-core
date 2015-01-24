/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/spec/node-cli-test.js
 */

var Spec = require('tgi-spec/dist/tgi.spec.js');
var testSpec = require('../dist/tgi.core.spec');
var spec = new Spec();
var TGI = require('../dist/tgi.core');
var readline = require('readline'),
  rl = readline.createInterface(process.stdin, process.stdout);

var cliServer = function (line, callback) {

  var output = '';

  switch (line.trim()) {
    case 'test':
      spec.runTests(function (msg) {
        if (msg.error) {
          console.error(msg.error);
          process.exit(1);
        } else if (msg.done) {
          console.log('Testing completed with  ...');
          console.log('testsCreated = ' + msg.testsCreated);
          console.log('testsPending = ' + msg.testsPending);
          console.log('testsFailed = ' + msg.testsFailed);
          if (msg.testsFailed || msg.testsPending) process.exit(1);
        } else if (msg.log) {
          //console.log(msg.log);
        }
      });
      break;

    case 'hello':
      output += line + '\nwhat up';
      break;

    case 'help':
      output += line + '\ni need someone';
      break;

    default:
      output += line + ' ??? type help for commands';
      break;
  }
  callback(output);
};

testSpec(spec, TGI);

rl.setPrompt(': ');
rl.prompt();
rl.on('line', function (line) {
  cliServer(line, function (output) {
    console.log(output);
    rl.prompt();
  });
}).on('close', function () {
  console.log('\nBye!');
  process.exit(0);
});

