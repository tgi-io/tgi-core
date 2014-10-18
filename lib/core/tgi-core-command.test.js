/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-command.spec.js
 */
spec.test('tgi-core/lib/tgi-core-command.test.js', 'Command', '<insert description>', function (callback) {

  spec.heading('Command Class', function () {
    spec.paragraph('The command design pattern is implemented with this class.  The actual execution of the command ' +
    'can be one of multiple types from simple code to a _Presentation Model_ applied to a _Interface_ implementation.');
    spec.heading('CONSTRUCTOR', function () {
      spec.example('objects created should be an instance of Command', true, function () {
        return new Command({name: 'about'}) instanceof Command;
      });
      spec.example('should make sure new operator used', Error('new operator required'), function () {
        Command({name: 'about'}); // jshint ignore:line
      });
      spec.example('should make sure argument properties are valid', Error('error creating Command: invalid property: sex'), function () {
        new Command({name: 'name', sex: 'female'});
      });
      spec.example('defaults name to (unnamed)', '(unnamed)', function () {
        return new Command().name;
      });
      spec.example('defaults type to Stub', 'Stub', function () {
        return new Command({name: 'about'}).type;
      });
    });
    spec.heading('PROPERTIES', function () {
      spec.heading('name', function () {
        spec.example('identifier name for command', 'about', function () {
          this.shouldThrowError(Error('name must be string'), function () {
            new Command({name: 42});
          });
          return new Command({name: 'about'}).name;
        });
      });
      spec.heading('description', function () {
        spec.example('more descriptive than name (for menus)', 'Tequila Command : Tequila is a beverage made from blue agave.', function () {
          // description set to (name) Command if not specified
          return new Command({name: 'Tequila'}).description + ' : ' +
            new Command({name: 'tequila', description: 'Tequila is a beverage made from blue agave.'}).description;
        });
      });
      spec.heading('type', function () {
        spec.example('type of command must be valid', Error('Invalid command type: magic'), function () {
          //spec.show(T.getCommandTypes());
          new Command({name: 'about', type: 'magic' });
        });
      });
      spec.heading('contents', function () {
        spec.paragraph('Contents is based on the type of command.  See TYPE section for more information for how it ' +
        'applies to each type');
      });
      spec.heading('scope', function () {
        spec.paragraph('Optional scope property can be used to apply a model or list to a command.');
        spec.example('scope must be a Model or a List', Error('optional scope property must be Model or List'), function () {
          new Command({name: 'archiveData', scope: true});
        });
      });
      spec.heading('status', function () {
        spec.paragraph('The status property is a Number defined as negative(FAIL) positive(SUCCESS) zero(executing) ' +
        'null/undefined(not executing).');
        spec.paragraph('Applications can give meaning to numeric values (lt -1 and gt 1) as long as sign is retained.');
      });
      spec.heading('timeout', function () {
        spec.paragraph('Will use library setting as default, override to set the default timeout for steps used in ' +
        'procedures. Value is milliseconds (1000 = 1 second)');
        spec.example('number required', Error('timeout must be a Number'), function () {
          new Command({name: 'options', timeout: true});
        });
      });
      spec.heading('theme', function () {
        spec.example('theme attribute provides visual cue', undefined, function () {
          // The good
          new Command({name: 'options', theme: 'default'});
          new Command({name: 'options', theme: 'primary'});
          new Command({name: 'options', theme: 'success'});
          new Command({name: 'options', theme: 'info'});
          new Command({name: 'options', theme: 'warning'});
          new Command({name: 'options', theme: 'danger'});
          new Command({name: 'options', theme: 'link'});
          // The bad
          this.shouldThrowError(Error('invalid theme'), function () {
            new Command({name: 'options', theme: 'Silly'});
          });
          // The ugly
          this.shouldThrowError(Error('invalid theme'), function () {
            new Command({name: 'options', theme: true});
          });
        });

      });
      spec.heading('icon', function () {
        spec.paragraph('The icon attribute gives a graphical association to the command.' +
        ' They are interface specific and do break the abstractness of this library but can be ignored by' +
        ' other interfaces safely.');
        spec.example('must be string and have prefix for 2 supported icon sets ' +
        'http://glyphicons.com/ http://fontawesome.io/', undefined, function () {

          this.shouldThrowError(Error('invalid icon'), function () {
            new Command({name: 'options', icon: true});
          });
          this.shouldThrowError(Error('invalid icon'), function () {
            new Command({name: 'options', icon: 'wtf-lol'});
          });
          // Only prefix is validated
          new Command({name: 'options', icon: 'fa-whatever'});
          new Command({name: 'options', icon: 'glyphicon-who-cares'});
          // Must have something to the right of the dash
          this.shouldThrowError(Error('invalid icon'), function () {
            new Command({name: 'options', icon: 'fa'});
          });
        });
      });

      spec.heading('bucket', function () {
        spec.example('valid property is for app use', 'bucket of KFC', function () {
          return 'bucket of ' + new Command({bucket: 'KFC'}).bucket;
        });
      });
    });
    spec.heading('TYPES', function () {
      spec.heading('menu', function () {
        spec.paragraph('The menu command is passed to _Interface_ for use for in user navigation.  ' +
        'They are embedded in the _Application_ as the primary navigate but can be instantiated and given to ' +
        '_Interface_ in any context.');
        spec.paragraph('The _Command_ contents property is an array _Command_ objects.');
        spec.example('constructor validates the contents', undefined, function () {
          this.shouldThrowError(Error('contents must be array of menu items'), function () {
            new Command({name: 'options', type: 'Menu'});
          });
          this.shouldThrowError(Error('contents must be array of menu items'), function () {
            new Command({name: 'options', type: 'Menu', contents: []});
          });
          this.shouldThrowError(Error('contents must be array of menu items'), function () {
            new Command({name: 'options', type: 'Menu', contents: [42]});
          });
          // This is a working example:
          new Command({name: 'options', type: 'Menu', contents: [
            'Stooges',                      // strings act as menu titles or non selectable choices
            '-',                            // dash is menu separator
            new Command({name: 'Tequila'})  // use commands for actual menu items
          ]});
        });
      });
      spec.heading('Presentation', function () {
        spec.example('for Presentation type contents is a Presentation object', undefined, function () {
          this.shouldThrowError(Error('contents must be a Presentation'), function () {
            new Command({name: 'options', type: 'Presentation'});
          });
        });
      });
      spec.heading('Function', function () {
        spec.paragraph('contents contains a javascript function');
        spec.example('for Function type contents is a Function', undefined, function () {
          this.shouldThrowError(Error('contents must be a Function'), function () {
            new Command({name: 'options', type: 'Function'});
          });
        });
      });
      spec.heading('Procedure', function () {
        spec.example('for Procedure type contents is a Procedure object', undefined, function () {
          this.shouldThrowError(Error('contents must be a Procedure'), function () {
            new Command({name: 'options', type: 'Procedure'});
          });
        });
      });
    });
    spec.heading('METHODS', function () {
      spec.heading('toString', function () {
        spec.example('returns string including name and type', 'I am a Stub Command: Customer', function () {
          return 'I am a ' + new Command({name: 'Customer'});
        });
      });
      spec.heading('abort', function () {
        spec.paragraph('aborts task');
        spec.example('aborted command ends with error status', -1, function () {
          var cmd = new Command();
          cmd.abort();
          return cmd.status;
        });
      });
      spec.heading('complete', function () {
        spec.paragraph('completes task');
        spec.example('call when task complete status', 1, function () {
          var cmd = new Command();
          cmd.complete();
          return cmd.status;
        });
      });
      spec.heading('execute', function () {
        spec.paragraph('executes task');
        spec.example('see integration tests', Error('command type Stub not implemented'), function () {
          new Command().execute();
        });
      });
      spec.heading('onEvent', function () {
        spec.paragraph('Use onEvent(events,callback)');
        spec.example('first parameter is a string or array of event subscriptions', Error('subscription string or array required'), function () {
          new Command().onEvent();
        });
        spec.example('callback is required', Error('callback is required'), function () {
          new Command().onEvent([]);
        });
        spec.example('events are checked against known types', Error('Unknown command event: onDrunk'), function () {
          new Command().onEvent(['onDrunk'], function () {
          });
        });
        spec.example('here is a working version', undefined, function () {
          //spec.show(T.getCommandEvents());
          //  BeforeExecute - callback called before first task executed but after tasks initialized
          //  AfterExecute - callback called after initial task(s) launched (see onCompletion)
          //  Error - error occurred (return {errorClear:true})
          //  Aborted - procedure aborted - should clean up resources
          //  Completed - execution is complete check status property
          new Command().onEvent(['Completed'], function () {
          });
        });
      });

    });
    // spec.runnerCommandIntegration();
  });
  

});
