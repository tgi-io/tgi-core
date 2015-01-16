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
  spec.example('objects created should be an instance of Interface', true, function () {
    var i = new SurrogateInterface();
    return (i instanceof SurrogateInterface) && (i instanceof Interface);
  });
  spec.example('should make sure new operator used', Error('new operator required'), function () {
    SurrogateInterface(); // jshint ignore:line
  });
  spec.example('should make sure argument properties are valid', Error('error creating Procedure: invalid property: yo'), function () {
    new SurrogateInterface({yo: 'whatup'});
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
      spec.example('defaults to a SurrogateInterface', 'a Interface', function () {
        return new SurrogateInterface().description;
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
      spec.example('callback parameter required', Error('callBack required'), function () {
        new SurrogateInterface().start(new Application(), new Presentation());
      });
    });
    spec.heading('stop()', function () {
      spec.paragraph('calling stop will end the start() processing and release any resources');
      spec.example('must pass callback function', Error('callBack required'), function () {
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
      spec.example('first argument must be a Presentation instance', Error('Presentation object required'), function () {
        new SurrogateInterface().render();
      });
      spec.example('optional callback must be function', Error('optional second argument must a commandRequest callback function'), function () {
        new SurrogateInterface().render(new Presentation(), true);
      });
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
    spec.heading('yesno(prompt, callBack)', function () {
      spec.paragraph('Query user with a yes no question.');
      spec.example('must set interface before invoking', Error('interface not set'), function () {
        new Application().yesno();
      });
      spec.example('must provide the text question param', Error('prompt required'), function () {
        new Application({interface: new Interface()}).yesno();
      });
      spec.example('must provide callback param', Error('callBack required'), function () {
        new Application({interface: new Interface()}).yesno('Are we there yet?');
      });
      spec.xexample('proper usage', Error('no mocks pending'), function () {
        new Application({interface: new Interface()}).yesno('¿comprendes d00d?', function (answer) {
        });
      });
    });
    spec.heading('ok(prompt, callBack)', function () {
      spec.paragraph('Pause before proceeding');
      spec.example('must set interface before invoking', Error('interface not set'), function () {
        new Application().ok();
      });
      spec.example('must provide the text prompt param', Error('prompt required'), function () {
        new Application({interface: new Interface()}).ok();
      });
      spec.example('must provide callback param', Error('callBack required'), function () {
        new Application({interface: new Interface()}).ok('You are about to enter the twilight zone.');
      });
      spec.xexample('proper usage', Error('no mocks pending'), function () {
        new Application({interface: new Interface()}).ok('You are about to enter the twilight zone.', function (answer) {
        });
      });
    });
    spec.heading('ask(prompt, attribute, callBack)', function () {
      spec.paragraph('Simple single item prompt.');
      spec.example('must provide the text question param', Error('prompt required'), function () {
        new Interface().ask();
      });
      spec.example('must supply attribute', Error('instance of Attribute a required parameter'), function () {
        new Interface().ask('What it do');
      });
      spec.example('must provide callback param', Error('callBack required'), function () {
        new Interface().ask('Please enter your name', new Attribute({name: 'Name'}));
      });
      spec.xexample('proper usage', Error('no mocks pending'), function () {
        new Application({interface: new Interface()}).ask('Who dis?', new Attribute({name: 'Name'}), function (answer) {
        });
      });
    });
    spec.heading('choose(prompt, choices, callBack)', function () {
      spec.paragraph('prompt to choose an item');
      spec.example('must provide text prompt first', Error('prompt required'), function () {
        new Interface().choose();
      });
      spec.example('must supply array of choices', undefined, function () {
        this.shouldThrowError(Error('choices array required'), function () {
          new Interface().choose('What it do');
        });
        this.shouldThrowError(Error('choices array required'), function () {
          new Interface().choose('this will not', 'work');
        });
        this.shouldThrowError(Error('choices array empty'), function () {
          new Interface().choose('empty array?', []);
        });
      });
      spec.example('must provide callback param', Error('callBack required'), function () {
        new Interface().choose('choose wisely', ['rock', 'paper', 'scissors']);
      });
      spec.xexample('proper usage', Error('no mocks pending'), function () {
        new Application({interface: new Interface()}).choose('Who dis?', ['Rick James', 'mammy', 'pappy'], function (answer) {
        });
      });
    });
  });
  spec.heading('Interface Integration', function () {
    spec.example('Test command execution mocking', spec.asyncResults(true), function (callback) {
      // Send 4 mocks and make sure we get 4 callback calls
      var self = this;
      self.callbackCount = 0;
      var testInterface = new Interface();
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
  });
};
