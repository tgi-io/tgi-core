/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/spec/repl-interface-test.js
 *
 * This demonstrates:
 * - creating a CLI with REPLInterface
 */

var tgi = require('../dist/tgi.core').CORE();
var repl = new tgi.REPLInterface();
var app = new tgi.Application({interface: repl});
var readline = require('readline');

/**
 * Commands in App
 */
var sayWhatCommand = new tgi.Command({
  name: 'what', type: 'Function', contents: function () {
    console.log('Say What?');
  }
});
var infoCommand = new tgi.Command({
  name: 'info', type: 'Function', contents: function () {
    console.log('This is the info command which will be converted to a presentation.');
  }
});

/**
 * App
 */
var menu = new tgi.Presentation();
menu.set('contents', [
  sayWhatCommand,
  infoCommand
]);
app.setPresentation(menu);
app.start(function (stuff) {
  ex.log('app got stuff: ' + JSON.stringify(stuff));
  console.log('app got stuff: ' + JSON.stringify(stuff));
});

/**
 * Route keyboard input from readline to REPLInterface
 */
var rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('sup? ');
rl.prompt();
rl.on('line', function (line) {
  repl.evaluateInput(line);
}).on('close', function () {
  console.log('wtf\nget the f* outa here');
  process.exit(0);
});

/**
 * Dump output captured from REPLInterface to console and show prompt
 * via REPLInterface
 */
repl.captureOutput(function (text) {
  console.log(text);
  rl.prompt();
});
