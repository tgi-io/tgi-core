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
      spec.paragraph('captureOutput(callback)');
      spec.example('called when line of input available', 'function', function () {
        return typeof REPLInterface.prototype.captureOutput;
      });
      spec.example('mixed example', spec.asyncResults('done'), function (callback) {
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
          app.ask('What is your name?',new Attribute({name:'Name'}), function (answer) {
            // repl.notify(new Message('Nice to meet you ' + answer + '.'));
            if (answer=='Sean') {
              callback('done');
            } else {
              callback(answer);
            }
          });
          input('Sean');
        };
        /**
         * Start the first test
         */
        ok1();
      });
    });
  });
});
