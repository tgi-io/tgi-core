/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-interface.spec.js
 */
spec.test('tgi-core/lib/tgi-core-interface.spec.js', 'Interface', 'enable user to communicate with app', function (callback) {
  spec.paragraph('The Interface core constructor is a prototype for user or system interaction with the application.' +
  ' The SurrogateInterface is a reference to Interface being tested in the suite.');
  spec.heading('CONSTRUCTOR', function () {
    spec.runnerInterfaceConstructor(Interface);
  });
  spec.runnerInterfaceMethods(Interface);
});
spec.runnerInterfaceConstructor = function (SurrogateInterface) {
  if (new SurrogateInterface().description == 'a REPLInterface') {
    spec.paragraph('see `Interface` for documentation');
    spec.mute(true);
  }
  spec.example('objects created should be an instance of Interface', true, function () {
    var i = new SurrogateInterface();
    return (i instanceof SurrogateInterface) && (i instanceof Interface);
  });
  spec.example('should make sure new operator used', Error('new operator required'), function () {
    SurrogateInterface(); // jshint ignore:line
  });
  spec.example('should make sure argument properties are valid', Error('error creating Interface: invalid property: yo'), function () {
    new SurrogateInterface({yo: 'whatup'});
  });
  spec.example('allowable properties', undefined, function () {
    new SurrogateInterface({name: 'pen', description: 'old school', vendor: Object}); // Vendor is reference needed vendor liblib
  });

};
spec.runnerInterfaceMethods = function (SurrogateInterface) {
  spec.heading('PROPERTIES', function () {
    spec.heading('name', function () {
      spec.example('defaults to (unnamed)', '(unnamed)', function () {
        return new SurrogateInterface().name;
      });
    });
    spec.heading('description', function () {
      spec.example('defaults to Interface implementation', undefined, function () {
        this.log(new SurrogateInterface().description);
      });
    });
  });
  spec.heading('METHODS', function () {
    spec.heading('toString()', function () {
      spec.example('should return a description of the message', 'Punched Card Interface', function () {
        return new SurrogateInterface({description: 'Punched Card Interface'}).toString();
      });
    });
    spec.heading('start()', function () {
      spec.paragraph('The start method initiates the interface and passes a callback for the interface to submit requests. ' +
      'The callback must pass a Request object followed by an optional callback for responses to the request e.g. ' +
      'interface.start ( function ( request, response(callback) ) ) {}');
      spec.example('Application parameter is required', Error('Application required'), function () {
        new SurrogateInterface().start();
      });
      spec.example('presentation parameter is required', Error('presentation required'), function () {
        new SurrogateInterface().start(new Application());
      });
      spec.example('callback parameter required', Error('callback required'), function () {
        new SurrogateInterface().start(new Application(), new Presentation());
      });
    });
    spec.heading('stop()', function () {
      spec.paragraph('calling stop will end the start() processing and release any resources');
      spec.example('must pass callback function', Error('callback required'), function () {
        new SurrogateInterface().stop();
      });
    });
    spec.heading('dispatch()', function () {
      spec.paragraph('The dispatch method will accept a request and act on it or pass it to the app.');
      spec.example('must pass a Request object', Error('Request required'), function () {
        new SurrogateInterface().dispatch();
      });
      spec.example('send command without callback when no response needed', undefined, function () {
        new SurrogateInterface().dispatch(new Request({type: 'Command', command: new Command()}));
      });
      spec.example('optional second parameter is the response callback', Error('response callback is not a function'), function () {
        new SurrogateInterface().dispatch(new Request({type: 'Command', command: new Command()}), true);
      });
    });
    spec.heading('notify()', function () {
      spec.paragraph('The notify method sends a `Message` to the Interface.  This can be the result of a request sent from the start() callback.');
      spec.example('must pass a Message object', Error('Message required'), function () {
        new SurrogateInterface().notify();
      });
    });
    spec.heading('render()', function () {


      spec.example('first argument must be a Command instance', Error('Command object required'), function () {
        new SurrogateInterface().render();
      });
      spec.paragraph('todo: cleanup fix tests since render is hacked/changed');
      //spec.example('first argument must be a Presentation instance', Error('Presentation object required'), function () {
      //  new SurrogateInterface().render();
      //});
      //spec.example('second argument must be a valid presentationMode', Error('presentationMode required'), function () {
      //  new SurrogateInterface().render(new Presentation());
      //});
      //spec.example('presentationMode must be valid', Error('Invalid presentationMode: Taco'), function () {
      //  new SurrogateInterface().render(new Presentation(), 'Taco');
      //});
      //spec.example('optional callback must be function', Error('optional second argument must a commandRequest callback function'), function () {
      //  new SurrogateInterface().render(new Presentation(), 'View', true);
      //});
    });
    spec.heading('canMock()', function () {
      spec.example('returns boolean to indicate if interface has mocking ability', 'boolean', function () {
        var canMock = new SurrogateInterface().canMock();
        return typeof canMock;
      });
    });
    spec.heading('mockRequest()', function () {
      spec.example('parameter must be request or array of requests', undefined, function () {
        var ui = new SurrogateInterface();
        this.shouldThrowError('Error: missing request parameter', function () {
          ui.mockRequest();
        });
        // Empty Stub Commands are ignored in mocks
        ui.mockRequest(new Request(new Command())); // Send single command
        ui.mockRequest([new Request(new Command()), new Request(new Command())]); // Send array of commands
        // Test when one of array elements is bad
        this.shouldThrowError('Error: invalid request parameter', function () {
          ui.mockRequest([new Request(new Command()), 'wtf']);
        });
      });
    });
    spec.heading('info(text)', function () {
      spec.paragraph('Display info to user in background of primary presentation.');
      spec.example('must set interface before invoking', Error('interface not set'), function () {
        new Application().info();
      });
      spec.example('must supply the text info', Error('text parameter required'), function () {
        new Application({interface: new SurrogateInterface()}).info();
      });
    });
    spec.heading('done(text)', function () {
      spec.paragraph('Display done to user in background of primary presentation.');
      spec.example('must set interface before invoking', Error('interface not set'), function () {
        new Application().done();
      });
      spec.example('must supply the text info', Error('text parameter required'), function () {
        new Application({interface: new SurrogateInterface()}).done();
      });
    });
    spec.heading('warn(text)', function () {
      spec.paragraph('Display warning to user in background of primary presentation.');
      spec.example('must set interface before invoking', Error('interface not set'), function () {
        new Application().warn();
      });
      spec.example('must supply the text info', Error('text parameter required'), function () {
        new Application({interface: new SurrogateInterface()}).warn();
      });
    });
    spec.heading('err(text)', function () {
      spec.paragraph('Display error to user in background of primary presentation.');
      spec.example('must set interface before invoking', Error('interface not set'), function () {
        new Application().err();
      });
      spec.example('must supply the text info', Error('text parameter required'), function () {
        new Application({interface: new SurrogateInterface()}).err();
      });
    });
    spec.heading('ok(prompt, callback)', function () {
      spec.paragraph('Pause before proceeding');
      spec.example('must set interface before invoking', Error('interface not set'), function () {
        new Application().ok();
      });
      spec.example('must provide the text prompt param', Error('prompt required'), function () {
        new Application({interface: new SurrogateInterface()}).ok();
      });
      spec.example('must provide callback param', Error('callback required'), function () {
        new Application({interface: new SurrogateInterface()}).ok('You are about to enter the twilight zone.');
      });
    });
    spec.heading('yesno(prompt, callback)', function () {
      spec.paragraph('Query user with a yes no question.');
      spec.example('must set interface before invoking', Error('interface not set'), function () {
        new Application().yesno();
      });
      spec.example('must provide the text question param', Error('prompt required'), function () {
        new Application({interface: new SurrogateInterface()}).yesno();
      });
      spec.example('must provide callback param', Error('callback required'), function () {
        new Application({interface: new SurrogateInterface()}).yesno('Are we there yet?');
      });
    });
    spec.heading('ask(prompt, attribute, callback)', function () {
      spec.paragraph('Simple single item prompt.');
      spec.example('must provide the text question param', Error('prompt required'), function () {
        new SurrogateInterface().ask();
      });
      spec.example('next param is attribute or callback', Error('attribute or callback expected'), function () {
        new SurrogateInterface().ask('What it do');
      });
      spec.example('must provide callback param', Error('callback required'), function () {
        new SurrogateInterface().ask('Please enter your name', new Attribute({name: 'Name'}));
      });
    });
    spec.heading('choose(prompt, choices, callback)', function () {
      spec.paragraph('prompt to choose an item');
      spec.example('must provide text prompt first', Error('prompt required'), function () {
        new SurrogateInterface().choose();
      });
      spec.example('must supply array of choices', undefined, function () {
        this.shouldThrowError(Error('choices array required'), function () {
          new SurrogateInterface().choose('What it do');
        });
        this.shouldThrowError(Error('choices array required'), function () {
          new SurrogateInterface().choose('this will not', 'work');
        });
        this.shouldThrowError(Error('choices array empty'), function () {
          new SurrogateInterface().choose('empty array?', []);
        });
      });
      spec.example('must provide callback param', Error('callback required'), function () {
        new SurrogateInterface().choose('choose wisely', ['rock', 'paper', 'scissors']);
      });
    });
  });
  spec.heading('Interface Integration', function () {
    if (new SurrogateInterface().canMock())
      spec.example('Test command execution mocking', spec.asyncResults(true), function (callback) {
        // Send 4 mocks and make sure we get 4 callback calls
        var self = this;
        self.callbackCount = 0;
        var testInterface = new SurrogateInterface();
        testInterface.start(new Application(), new Presentation(), function (request) {
          if (request.type == 'mock count')
            self.callbackCount++;
          if (self.callbackCount > 3)
            callback(true);
        });
        var cmds = [];
        var i;
        for (i = 0; i < 4; i++) {
          cmds.push(new Request('mock count'));
        }
        testInterface.mockRequest(cmds);
      });
    // todo update to create app and start interface -or- make libs like bootstrap work without exploding
    spec.xexample('user queries', spec.asyncResults('The End'), function (callback) {
      var io = new SurrogateInterface();
      var app = new Application({interface: io});
      /**
       * Each test is a function ...
       */
      var ok1 = function () {
        io.mockRequest(new Request('ok'));
        app.ok('You can mock ok() before', function () {
          ok2();
        });
      };
      var ok2 = function () {
        app.ok('You can mock ok() after', function () {
          yesno1();
        });
        io.mockRequest(new Request('ok'));
      };
      var yesno1 = function () {
        app.yesno('Yesno can be true', function (answer) {
          if (answer)
            yesno2();
          else
            callback('fail');
        });
        io.mockRequest(new Request('yes'));
      };
      var yesno2 = function () {
        app.yesno('Yesno can be false', function (answer) {
          if (!answer)
            yesno3();
          else
            callback('fail');
        });
        io.mockRequest(new Request('no'));
      };
      var yesno3 = function () {
        app.yesno('Yesno can be undefined', function (answer) {
          if (!answer)
            ask1();
          else
            callback('fail');
        });
        io.mockRequest(new Request('cancel'));
      };
      var ask1 = function () {
        var name = new Attribute({name: 'Name'});
        app.ask('What is your name?', name, function (answer) {
          app.info('Hello ' + answer);
          if (answer == 'John Doe')
            ask2();
          else
            callback(answer);
        });
        io.mockRequest(new Request({type: 'ask', value: 'John Doe'}));
      };
      var ask2 = function () {
        var name = new Attribute({name: 'Name'});
        io.mockRequest(new Request({type: 'ask'})); // no value like canceled dialog
        app.ask('Vas is das name?', name, function (answer) {
          if (undefined === answer)
            choose1();
          else
            callback(answer);
        });
      };
      var choose1 = function () {
        app.choose('Pick one...', ['chicken', 'beef', 'tofu'], function (choice) {
          if (choice == 1)
            choose2();
          else
            callback(choice);
        });
        io.mockRequest(new Request({type: 'choose', value: 'beef'}));
      };
      var choose2 = function () {
        io.mockRequest(new Request({type: 'choose'})); // no value like canceled dialog
        app.choose('Pick one...', ['chicken', 'beef', 'tofu'], function (choice) {
          if (undefined === choice)
            callback('The End');
          else
            callback(choice);
        });
      };
      /**
       * Launch test
       */
      ok1();
    });
  });
  if (new SurrogateInterface().description == 'a REPLInterface') {
    var wasMuted = spec.mute(false).testsCreated;
    spec.example('interface tests applied', true, function () {
      this.log('Tests Muted: ' + wasMuted);
      return wasMuted > 0;
    });
  }
};
