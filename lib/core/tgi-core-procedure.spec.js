/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-procedure.spec.js
 */
spec.test('tgi-core/lib/tgi-core-procedure.spec.js', 'Procedure', 'manages set of Commands synchronous or asynchronous', function (callback) {
  spec.heading('Procedure Class', function () {
    spec.paragraph('`Procedure` manages a set of _Command_ objects.  It provides a pattern for handling ' +
    'asynchronous and synchronous command execution.');
    spec.paragraph('_Command_ objects create and manage the _Procedure_ object.');
    spec.heading('CONSTRUCTOR', function () {
      spec.example('objects created should be an instance of Procedure', true, function () {
        return new Procedure() instanceof Procedure;
      });
      spec.example('should make sure new operator used', Error('new operator required'), function () {
        Procedure(); // jshint ignore:line
      });
      spec.example('should make sure argument properties are valid', Error('error creating Procedure: invalid property: yo'), function () {
        new Procedure({yo: 'whatup'});
      });
    });
    spec.heading('PROPERTIES', function () {
      spec.heading('tasks', function () {
        spec.paragraph('Tasks is an array of objects that represent each step of the procedure.  See TASKS section ' +
        'below for each property of this unnamed object (task array element).');
        spec.example('tasks can be falsy if no tasks defined otherwise it has to be an array',
          Error('error creating Procedure: tasks is not an array'), function () {
            new Procedure({tasks: true});
          });
        spec.example('the parameters must be valid for the object in each element of the array',
          Error('error creating Procedure: invalid task[0] property: clean'), function () {
            new Procedure({
              tasks: [
                {clean: 'room'}
              ]
            });
          });
      });
      spec.heading('tasksNeeded', function () {
        spec.paragraph('Total tasks that will execute (does not include skipped tasks).');
        spec.paragraph('_See Integration Tests for usage_');
      });
      spec.heading('tasksCompleted', function () {
        spec.paragraph('Number of tasks completed and started (does not include skipped tasks)');
        spec.paragraph('_See Integration Tests for usage_');
      });
    });
    spec.heading('TASKS', function () {
      spec.paragraph('Each element of the array tasks is an object with the following properties:');
      spec.heading('label', function () {
        spec.paragraph('optional label for this task task element');
        spec.example('if used it must be a string', Error('error creating Procedure: task[0].label must be string'), function () {
          new Procedure({
            tasks: [
              {label: true}
            ]
          });
        });
      });
      spec.heading('command', function () {
        spec.paragraph('Command to execute for this task');
        spec.example('if used it must be a string', Error('error creating Procedure: task[0].command must be a Command object'), function () {
          new Procedure({
            tasks: [
              {command: true}
            ]
          });
        });
      });
      spec.heading('requires', function () {
        spec.paragraph('Establish other tasks that must be complete before this task is executed.  ' +
        'Pass as array of or single element. Can be string(for label label) or number(for array index).  ' +
        'Use -1 for previous task, null for no dependencies');
        spec.example('test it', undefined, function () {
          this.shouldThrowError(Error('invalid type for requires in task[0]'), function () {
            new Procedure({
              tasks: [
                {requires: new Date()}
              ]
            });
          });
          // if number supplied it is index in array
          this.shouldThrowError(Error('missing task #1 for requires in task[0]'), function () {
            new Procedure({
              tasks: [
                {command: new Procedure({}), requires: 1}
              ]
            });
          });
          this.shouldThrowError(Error('task #-2 invalid requires in task[0]'), function () {
            new Procedure({
              tasks: [
                {command: new Procedure({}), requires: -2}
              ]
            });
          });
          // requires defaults to -1 which means the previous element in the array so essentially the default
          // is sequential processing.  Set to null for no dependencies which makes it asynchronous -1 means
          // previous element is ignored for first index and is the default
          var proc = new Procedure({
            tasks: [
              {command: new Command({})}
            ]
          });
          this.shouldBeTrue(proc.tasks[0].requires == -1);
        });
      });
    });
    spec.heading('METHODS', function () {
      spec.heading('getObjectStateErrors', function () {
        spec.example('should return array of validation errors', 'falsy', function () {
          if (!new Procedure().getObjectStateErrors()) return 'falsy';
        });
      });
    });
    spec.heading('INTEGRATION', function () {
      spec.example('synchronous sequential tasks are the default when tasks has no requires property', spec.asyncResults('abc123'), function (callback) {
        var cmd = new Command({
          name: 'cmdProcedure', type: 'Procedure', contents: new Procedure({
            tasks: [
              {
                command: new Command({
                  type: 'Function',
                  contents: function () {
                    var self = this;
                    setTimeout(function () {
                      self._parentProcedure.bucket += '1';
                      self.complete();
                    }, 250); // delayed to test that order is maintained
                  }
                })
              },
              {
                command: new Command({
                  type: 'Function',
                  contents: function () {
                    this._parentProcedure.bucket += '2';
                    this.complete();
                  }
                })
              },
              function () { // shorthand version of command function ...
                this._parentProcedure.bucket += '3';
                this.complete();
              }
            ]
          })
        });
        cmd.onEvent('*', function (event) {
          if (event == 'Completed') callback(cmd.bucket);
        });
        cmd.bucket = 'abc';
        cmd.execute();
      });
      spec.example('async tasks are designated when requires is set to null', spec.asyncResults('eenie meenie miney mo miney mo'), function (callback) {
        var execCount = 0; // Call twice to test reset state

        var cmd = new Command({
          name: 'cmdProcedure', type: 'Procedure', contents: new Procedure({
            tasks: [
              {
                command: new Command({
                  type: 'Function',
                  contents: function () {
                    var self = this;
                    setTimeout(function () {
                      self._parentProcedure.bucket += ' mo';
                      self.complete();
                    }, 50); // This will be done last
                  }
                })
              },
              {
                requires: null, // no wait to run this
                command: new Command({
                  type: 'Function',
                  contents: function () {
                    this._parentProcedure.bucket += ' miney';
                    this.complete();
                  }
                })
              }
            ]
          })
        });
        cmd.onEvent('*', function (event) {
          if (event == 'Completed') {
            if (execCount++ < 2) {
              cmd.execute();
            } else {
              callback(cmd.bucket);
            }
          }

        });
        cmd.bucket = 'eenie meenie';
        execCount++;
        cmd.execute();
      });
      spec.example('this example shows multiple dependencies', spec.asyncResults('todo: drugs sex rock & roll'), function (callback) {
        var cmd = new Command({
          name: 'cmdProcedure', type: 'Procedure', contents: new Procedure({
            tasks: [
              {
                command: new Command({
                  type: 'Function',
                  contents: function () {
                    var self = this;
                    setTimeout(function () {
                      self._parentProcedure.bucket += ' rock';
                      self.complete();
                    }, 300);
                  }
                })
              },
              {
                requires: null, // no wait to run this
                label: 'sex',
                command: new Command({
                  type: 'Function',
                  contents: function () {
                    var self = this;
                    setTimeout(function () {
                      self._parentProcedure.bucket += ' sex';
                      self.complete();
                    }, 200);
                  }
                })
              },
              {
                requires: null, // no wait to run this
                label: 'drugs',
                command: new Command({
                  type: 'Function',
                  contents: function () {
                    var self = this;
                    setTimeout(function () {
                      self._parentProcedure.bucket += ' drugs';
                      self.complete();
                    }, 100);
                  }
                })
              },
              {
                requires: ['sex', 'drugs', 0], // need these labels and array index 0
                command: new Command({
                  type: 'Function',
                  contents: function () {
                    this._parentProcedure.bucket += ' & roll';
                    this.complete();
                  }
                })
              }
            ]
          })
        });
        cmd.onEvent('*', function (event) {
          if (event == 'Completed') callback(cmd.bucket);
        });
        cmd.bucket = 'todo:';
        cmd.execute();
      });
    });
  });
});
