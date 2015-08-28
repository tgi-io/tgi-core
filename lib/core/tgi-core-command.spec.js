/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-command.spec.js
 */
spec.test('tgi-core/lib/tgi-core-command.spec.js', 'Command', 'encapsulates task execution', function (callback) {
  spec.paragraph('Command is an abstraction for task execution.  It provides multiple methods of task execution ' +
  'and manages the overall state of both synchronous and asynchronous processes. ' +
  'The primary use is to have a simple API method to respond to UI tasks. ' +
  'It can be used for processing / validation / storage / reporting type of use cases since ' +
  'it handles the asynchronous nature of javascript and abstracts in a way to easily incorporate application logic.');
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
    spec.example('defaults name to a command', 'a command', function () {
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
      spec.example('more descriptive than name', 'Tequila Command : Tequila is a beverage made from blue agave.', function () {
        // description set to (name) Command if not specified
        return new Command({name: 'Tequila'}).description + ' : ' +
          new Command({name: 'tequila', description: 'Tequila is a beverage made from blue agave.'}).description;
      });
    });
    spec.heading('type', function () {
      spec.example('type of command must be valid', Error('Invalid command type: magic'), function () {
        this.log(Command.getTypes());
        new Command({name: 'about', type: 'magic'});
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
      spec.paragraph('Valid themes listed in example.  These were inspired by bootstrap so fit that well and is' +
      ' optional for implementation but should follow if possible.  Example PDF is b/w and may ignore ot more likely' +
      ' will never apply.');
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
    spec.heading('location', function () {
      spec.example('optional for control location {x,y}', undefined, function () {
        new Command({name: 'options', location: {x: 0, y: 0}});
      });
    });
    spec.heading('images', function () {
      spec.example('optional for control graphical representation', undefined, function () {
        new Command({name: 'options', images: []});
      });
    });
    spec.heading('presentationMode', function () {
      spec.paragraph('this property is used for presentation commands to specify the mode of presentation');
      spec.example('default is View', 'View', function () {
        return new Command({type: 'Presentation', contents: new Presentation()}).presentationMode;
      });
      spec.example('can supply in constructor', 'Edit', function () {
        return new Command({
          type: 'Presentation',
          contents: new Presentation(),
          presentationMode: 'Edit'
        }).presentationMode;
      });
      spec.example('must be valid mode', Error('Invalid presentationMode: Projector'), function () {
        this.log(Command.getPresentationModes());
        new Command({type: 'Presentation', contents: new Presentation(), presentationMode: 'Projector'});
      });

    });
    spec.heading('bucket', function () {
      spec.example('valid property is for app use', 'bucket of KFC', function () {
        // no real test but library will never use this word in general (TODO expand somehow ... ?).
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
        new Command({
          name: 'options', type: 'Menu', contents: [
            'Stooges',                      // strings act as menu titles or non selectable choices
            '-',                            // dash is menu separator
            new Command({name: 'Tequila'})  // use commands for actual menu items
          ]
        });
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
      spec.example('see integration tests for usage', Error('command type Stub not implemented'), function () {
        new Command().execute();
      });
      spec.example('presentation commands require interface param', Error('interface param required'), function () {
        new Command({type: 'Presentation', contents: new Presentation()}).execute();
      });
    });
    spec.heading('restart', function () {
      spec.paragraph('restarts task');
      spec.example('see integration tests', Error('command type Stub not implemented'), function () {
        new Command().restart();
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
        this.log(Command.getEvents());
        //  BeforeExecute - callback called before first task executed but after tasks initialized
        //  AfterExecute - callback called after initial task(s) launched (see onCompletion)
        //  Error - error occurred (return {errorClear:true})
        //  Aborted - procedure aborted - should clean up resources
        //  Completed - execution is complete check status property
        new Command().onEvent(['Completed'], function () {
        });
      });
    });
    spec.heading('Command.getTypes', function () {
      spec.paragraph('This helper function returns an array of valid Command types.  This is just a function - not a prototype method.');
      spec.example('show the types', undefined, function () {
        this.log(Command.getTypes());
      });
    });
    spec.heading('Command.getEvents', function () {
      spec.paragraph('This helper function returns an array of valid Command events.  This is just a function - not a prototype method.');
      spec.example('show the events', undefined, function () {
        this.log(Command.getEvents());
      });
    });
  });
  spec.heading('INTEGRATION', function () {
    spec.paragraph('test each command type');

    // Stub
    spec.example('Stub', Error('command type Stub not implemented'), function () {
      var cmd = new Command({
        name: 'stubCommand',
        description: 'stub command test',
        type: 'Stub'
      });
      this.log(cmd);
      cmd.execute();
    });

    // Menu todo - placeholder or not needed?
    spec.xexample('Menu', Error('command type Menu not implemented'), function () {
      var cmd = new Command({
        name: 'menuCommand',
        description: 'menu command test',
        type: 'Menu',
        contents: ['Hello World']
      });
      this.log(cmd);
      cmd.execute();
    });

    // Presentation
    spec.example('Presentation', undefined, function () {
      var cmd = new Command({
        name: 'presentationCommand',
        description: 'presentation command test',
        type: 'Presentation',
        contents: new Presentation()
      });
      this.shouldThrowError(Error('contents must be a Presentation'), function () {
        cmd.contents = 123;
        cmd.execute();
      });
      this.shouldThrowError(Error('error executing Presentation: contents elements must be Command, Attribute, List or string'), function () {
        cmd.contents = new Presentation();
        cmd.contents.set('contents', [new Command(), new Attribute({name: 'meh'}), true]);
        cmd.execute();
      });
    });

    // Function
    spec.example('Function test straight up', spec.asyncResults('Hola! BeforeExecute AfterExecute Adious! funk Completed BeforeExecute AfterExecute funk Completed'), function (callback) {
      var execCount = 0; // Call twice to test reset state

      var cmd = new Command({
        type: 'Function',
        contents: function () {
          this.bucket += ' funk';
          this.complete();
        }
      });
      cmd.bucket = 'Hola!';
      // Monitor all events
      cmd.onEvent(['BeforeExecute', 'AfterExecute', 'Error', 'Aborted', 'Completed'], function (event) {
        this.bucket += ' ' + event;
        if (event == 'Completed') {
          if (execCount++ < 2)
            cmd.execute();
          else
            callback(this.bucket);
        }
      });
      execCount++;
      cmd.execute();
      cmd.bucket += ' Adious!';
    });

    // Function error
    spec.example('Function test with error', spec.asyncResults('Hola! BeforeExecute AfterExecute Adious! funk Error Completed'), function (callback) {
      var cmd = new Command({
        type: 'Function',
        contents: function () {
          this.bucket += ' funk';
          throw new Error('function go boom!');
        }
      });
      cmd.bucket = 'Hola!';
      // Monitor all events
      cmd.onEvent('*', function (event) { // * for all events
        this.bucket += ' ' + event;
        if (event == 'Completed') callback(this.bucket);
      });
      cmd.execute();
      cmd.bucket += ' Adious!';
    });

    // Function abort
    spec.example('Function test with abort', spec.asyncResults('Hola! BeforeExecute AfterExecute Adious! funk Aborted Completed'), function (callback) {
      var cmd = new Command({
        type: 'Function',
        contents: function () {
          this.bucket += ' funk';
          this.abort();
        }
      });
      cmd.bucket = 'Hola!';
      // Monitor all events
      cmd.onEvent(['BeforeExecute', 'AfterExecute', 'Error', 'Aborted', 'Completed'], function (event) {
        this.bucket += ' ' + event;
        if (event == 'Completed') callback(this.bucket);
      });
      cmd.execute();
      cmd.bucket += ' Adious!';
    });

    // Procedure
    spec.example('Procedure', undefined, function () {
      var cmd = new Command({
        name: 'procedureCommand',
        description: 'procedure command test',
        type: 'Procedure',
        contents: new Procedure()
      });
      this.log(cmd);
      cmd.execute();
    });
    spec.paragraph('(Better example under `Procedure` Constructer)');
    spec.paragraph('More stuff');
    spec.example('Error event passes error object', spec.asyncResults('Error: boom'), function (callback) {
      var cmd = new Command({
        type: 'Function',
        contents: function () {
          throw new Error('boom');
        }
      });
      cmd.onEvent(['Error'], function (event, err) {
        callback(err);
      });
      cmd.execute();
    });

  });
});
