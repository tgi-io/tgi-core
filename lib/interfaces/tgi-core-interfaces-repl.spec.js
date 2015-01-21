/**---------------------------------------------------------------------------------------------------------------------
 * lib/interfaces/tgi-core-interfaces-repl.spec.js
 */

spec.testSection('Interfaces');
spec.test('tgi-core/lib/interfaces/tgi-core-interfaces-repl.spec.js', 'REPLInterface', 'Read Evaluate Print Loop Interface', function (callback) {
  spec.heading('REPLInterface', function () {
    spec.paragraph('The REPLInterface is a Read Evaluate Print Loop Interface.');
    spec.heading('CONSTRUCTOR', function () {
      spec.runnerInterfaceConstructor(REPLInterface);
    });
    spec.runnerInterfaceMethods(REPLInterface);
    spec.heading('METHODS', function () {
      spec.paragraph('The REPLInterface defines adds the following methods.');
      spec.paragraph('evaluateInput(line)');
      spec.example('called when line of input available', 'function', function () {
        return typeof REPLInterface.prototype.evaluateInput;
      });
      spec.example('if no input state error generated', undefined, function () {
      });
      spec.paragraph('captureOutput(callback)');
      spec.example('called when line of input available', 'function', function () {
        return typeof REPLInterface.prototype.captureOutput;
      });
    });
    spec.heading('INTEGRATION', function () {
      spec.example('user queries', spec.asyncResults('done'), function (callback) {
        var repl = new REPLInterface();
        var app = new Application({interface: repl});
        var ex = this;
        repl.captureOutput(function (text) {
          ex.log('out> ' + text);
          //console.log('out> ' + text);
        });
        repl.evaluateInput('input ignored if no context for it');
        var input = function (text) {
          ex.log('in> ' + text);
          //console.log('in> ' + text);
          repl.evaluateInput(text);
        };
        /**
         * test per function
         */
        var ok1 = function () {
          app.ok('This is a test.', function () {
            yesno1();
          });
          input('whatever');
        };
        var yesno1 = function () {
          app.yesno('Are we having fun?', function (answer) {
            if (answer) {
              callback(answer);
            } else {
              yesno2();
            }
          });
          input('hell no');
        };
        var yesno2 = function () {
          app.yesno('Should I continue?', function (answer) {
            if (answer) {
              ask1();
            } else {
              callback(answer);
            }
          });
          input('y');
        };
        var ask1 = function () {
          app.ask('What is your name?', new Attribute({name: 'Name'}), function (answer) {
            repl.info('Nice to meet you ' + answer + '.');
            if (answer == 'Sean') {
              choose1();
            } else {
              callback(answer);
            }
          });
          input('Sean');
        };
        var choose1 = function () {
          app.choose('Pick one...', ['Eenie', 'Meenie', 'Miney', 'Moe'], function (choice) {
            if (choice == 1)
              callback('done');
            else
              callback(choice);
          });
          input('m'); // first partial match
        };
        /**
         * Start the first test
         */
        ok1();
      });
      spec.example('app navigation', spec.asyncResults('RockPaperScissors'), function (callback) {
        var repl = new REPLInterface();
        var app = new Application({interface: repl});
        var ex = this;
        repl.captureOutput(function (text) {
          ex.log('out> ' + text);
          console.log('out> ' + text);
        });
        var input = function (text) {
          ex.log('in> ' + text);
          console.log('in> ' + text);
          repl.evaluateInput(text);
        };

        var answer = '';
        var rockCommand = new Command({name: 'Rock', type: 'Function', contents: function () {
          answer += 'Rock';
        }});
        var paperCommand = new Command({name: 'Paper', type: 'Function', contents: function () {
          answer += 'Paper';
        }});
        var scissorsCommand = new Command({name: 'Scissors', type: 'Function', contents: function () {
          answer += 'Scissors';
        }});
        var seeYouCommand = new Command({name: 'SeeYou', type: 'Function', contents: function () {
          callback(answer);
        }});
        var menu = new Presentation();
        menu.set('name', 'Public Menu');
        menu.set('contents', [
          'How will string be handled?',
          new Attribute({name:'junk'}),
          rockCommand,
          paperCommand,
          scissorsCommand,
          seeYouCommand
        ]);
        app.setPresentation(menu);
        app.start(function (stuff) {
          ex.log('app got stuff: ' + JSON.stringify(stuff));
          console.log('app got stuff: ' + JSON.stringify(stuff));
        });
        input('Rockaby');
        input('r');
        input('p');
        input('s');
        input('se');
      });
    });
  });
});
