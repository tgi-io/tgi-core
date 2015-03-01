/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/spec/repl-interface-test.js
 *
 * This demonstrates:
 * - creating a CLI with REPLInterface
 */

var readline = require('readline');
var chalk = require('chalk');
var tgi = require('../dist/tgi.core').CORE();
var repl = new tgi.REPLInterface();
var app = new tgi.Application({interface: repl});
app.set('brand', 'TEST');
/**
 * Commands in App
 */
var sayWhatCommand = new tgi.Command({
  name: 'what', type: 'Function', contents: function () {
    app.info('Say What?');
  }
});
var infoCommand = new tgi.Command({
  name: 'info', type: 'Function', contents: function () {
    app.info('This is the info command which will be converted to a presentation.');
  }
});
/**
 * Commands
 */
var name,
  isDude,
  color;
var userQueryCommand = new tgi.Command({
  name: 'User Queries', type: 'Procedure', contents: new tgi.Procedure({
    tasks: [
      function () {
        var task = this;
        app.ask('What is first your name?', new tgi.Attribute({name: 'name'}), function (reply) {
          if (!reply)
            userQueryCommand.abort();
          else {
            name = reply;
            task.complete();
          }
        });
      },
      function () {
        var task = this;
        app.yesno(name + ' are you a dude?', function (reply) {
          if (undefined === reply)
            userQueryCommand.abort();
          else {
            isDude = reply;
            task.complete();
          }
        });
      },
      function () {
        var task = this;
        var colors = ['red', 'green', 'blue', 'black', 'white'];
        app.choose('OK ' + (isDude ? 'mr. ' : 'ms. ') + name + ', please pick a color.\nany color..\n\nplease pick one now', colors, function (choice) {
          if (!choice)
            userQueryCommand.abort();
          else {
            color = colors[choice];
            task.complete();
          }
        });
      },
      function () {
        var task = this;
        app.ok(name + ' is a ' + color + (isDude ? ' dude.' : ' chick.') + '\n\n*** THE END ***', function () {
          task.complete();
        });
      }
    ]
  })
});
userQueryCommand.onEvent('*', function (event) {
  if (event == 'Aborted') {
    app.info('ok fine be that way');
  }
});
// Create a function command
var funcCommand = new tgi.Command({
  name: 'Function', type: 'Function', contents: function () {
    window.alert("Hello! I am an alert box!!");
  }
});

// Create a procedure command
var procCommand = new tgi.Command({name: 'Procedure', type: 'Procedure', contents: new tgi.Procedure()});

// Stub commands
var stubMoe = new tgi.Command({name: 'Moe', description: 'Moses Horwitz', theme: 'primary', icon: 'fa-coffee'});
var stubLarry = new tgi.Command({name: 'Larry', description: 'Louis Fienberg', theme: 'info', icon: 'fa-beer'});
var stubCurly = new tgi.Command({
  name: 'Curly',
  description: 'Jerome Lester Horwitz',
  theme: 'warning',
  icon: 'fa-glass'
});

// Create sample presentation
var pres = new tgi.Presentation();
pres.set('contents', [
  '####INSTRUCTIONS\n\n' +
  'Enter some stuff then push some buttons.',
  '-',
  new tgi.Attribute({name: 'firstName', label: 'First Name', type: 'String(20)', value: 'John'}),
  new tgi.Attribute({name: 'lastName', label: 'Last Name', type: 'String(25)', value: 'Doe'}),
  new tgi.Attribute({name: 'address', label: 'Address', type: 'String(50)'}),
  new tgi.Attribute({name: 'city', label: 'City', type: 'String(35)'}),
  new tgi.Attribute({name: 'state', label: 'State', type: 'String(2)'}),
  new tgi.Attribute({name: 'zip', label: 'Zip Code', type: 'String(10)', placeHolder: '#####-####'}),
  new tgi.Attribute({name: 'birthDate', label: 'Birth Date', type: 'Date', value: new Date()}),
  new tgi.Attribute({name: 'drink', type: 'String(25)', quickPick: ['Water', 'Coke', 'Coffee']}),
  new tgi.Attribute({name: 'sex', type: 'Boolean', value: true}),
  new tgi.Attribute({name: 'drugs', type: 'Boolean', value: false}),
  new tgi.Attribute({name: 'IQ', type: 'Number', value: 100}),
  '-',
  funcCommand,
  procCommand,
  stubMoe,
  stubLarry,
  stubCurly
]);
var presCommand = new tgi.Command({name: 'Presentation', type: 'Presentation', contents: pres});
var commands = new tgi.Command({
  name: 'Commands', type: 'Menu', contents: [
    'Command Types',
    '-',
    new tgi.Command({name: 'Stub', type: 'Stub'}),
    presCommand,
    funcCommand,
    procCommand
  ]
});

/**
 * App
 */
var menu = new tgi.Presentation();
menu.set('contents', [
  sayWhatCommand,
  infoCommand,
  new tgi.Command({
    name: 'Stooges', type: 'Menu', contents: [
      'The Three Stooges',
      '-',
      stubMoe,
      stubLarry,
      stubCurly,
      commands
    ]
  }),
  commands,
  userQueryCommand,
  '-',
  new tgi.Command({name: 'Account'})

]);
app.setPresentation(menu);

/**
 * Route keyboard input from readline to REPLInterface
 */
var rl = readline.createInterface(process.stdin, process.stdout);
rl.on('line', function (line) {
  try {
    repl.evaluateInput(line);
  } catch (e) {
    console.error('' + e);
    rl.prompt();
  }
}).on('close', function () {
  console.log('wtf\nget the f* outa here');
  process.exit(0);
});

/**
 * Dump output captured from REPLInterface to console and show prompt
 * via REPLInterface
 */
repl.captureOutput(function (text) {
  console.log(chalk.blue(text));
});
repl.capturePrompt(function (text) {
  var i = text.indexOf('\n');
  var atext = text;
  if (i >= 0) {
    atext = text.substr(i + 1);
  }
  rl.setPrompt(chalk.bold.cyan(text) + ' ', atext.length + 1);
  rl.prompt();
});
/**
 * Start the app
 */
app.start(function (stuff) {
  console.log('app got stuff: ' + JSON.stringify(stuff));
});
