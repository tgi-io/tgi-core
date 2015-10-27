/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/models/tgi-core-model-application.test.js
 */
spec.testSection('Models');
spec.test('tgi-core/lib/models/tgi-core-model-application.spec.js', 'Application', 'manages active state and configuration', function (callback) {
  spec.heading('CONSTRUCTOR', function () {
    spec.example('objects created should be an instance of Application', true, function () {
      return new Application() instanceof Application;
    });
    spec.testModel(Application);
    spec.example('argument property interface will invoke setInterface method', true, function () {
      var myInterface = new Interface();
      var myApplication = new Application({interface: myInterface});
      return (myApplication.getInterface() === myInterface);
    });

  });
  spec.heading('ATTRIBUTES', function () {
    spec.paragraph('Application extends model and inherits the attributes property.  All Application objects ' +
    'have the following attributes:');
    spec.example('following attributes are defined:', undefined, function () {
      var presentation = new Application(); // default attributes and values
      this.shouldBeTrue(presentation.get('name') === 'newApp');
      this.shouldBeTrue(presentation.get('brand') === 'NEW APP');
    });
  });
  spec.heading('METHODS', function () {
    spec.heading('setInterface(interface)', function () {
      spec.paragraph('Setting the interface for the application determines the primary method of user interaction.');
      spec.example('must supply Interface object', Error('instance of Interface a required parameter'), function () {
        new Application().setInterface();
      });
    });
    spec.heading('getInterface()', function () {
      spec.paragraph('returns primary user interface for application');
      spec.example('default is undefined', true, function () {
        return new Application().getInterface() === undefined;
      });
      spec.example('returns value set by set Interface', true, function () {
        var myInterface = new Interface();
        var myApplication = new Application();
        myApplication.setInterface(myInterface);
        return (myApplication.getInterface() === myInterface);
      });
    });
    spec.heading('setPresentation(presentation)', function () {
      spec.paragraph('Setting the presentation for the application determines the primary commands available to the user.');
      spec.example('must supply Presentation object', Error('instance of Presentation a required parameter'), function () {
        new Application().setPresentation();
      });
    });
    spec.heading('getPresentation()', function () {
      spec.paragraph('returns primary user presentation for application');
      spec.example('default is undefined', true, function () {
        return new Application().getPresentation() === undefined;
      });
      spec.example('returns value set by set Presentation', true, function () {
        var myPresentation = new Presentation();
        var myApplication = new Application();
        myApplication.setPresentation(myPresentation);
        return (myApplication.getPresentation() === myPresentation);
      });
    });
    spec.heading('start()', function () {
      spec.paragraph('The start method executes the application.');
      spec.example('must set interface before starting', Error('error starting application: interface not set'), function () {
        new Application().start();
      });
      spec.example('callback parameter required', Error('callback required'), function () {
        new Application({interface: new Interface()}).start();
      });
    });
    spec.heading('dispatch()', function () {
      spec.paragraph('The dispatch method will accept a request and act on it or pass it to the app.');
      spec.example('must pass a Request object', Error('Request required'), function () {
        new Application().dispatch();
      });
      spec.example('send command without callback when no response needed', undefined, function () {
        var ex = this;
        new Application().dispatch(new Request({
          type: 'Command', command: new Command(function () {
            ex.log('PEACE');
          })
        }));
      });
      spec.example('optional second parameter is the response callback', Error('response callback is not a function'), function () {
        new Application().dispatch(new Request({type: 'Command', command: new Command()}), true);
      });
    });
    spec.heading('info(text)', function () {
      spec.paragraph('Display info to user in background of primary presentation.');
      spec.example('must set interface before invoking', Error('interface not set'), function () {
        new Application().info(); // see Interface for more info
      });
    });
    spec.heading('done(text)', function () {
      spec.paragraph('Display done to user in background of primary presentation.');
      spec.example('must set interface before invoking', Error('interface not set'), function () {
        new Application().done(); // see Interface for more info
      });
    });
    spec.heading('warn(text)', function () {
      spec.paragraph('Display info to user in background of primary presentation.');
      spec.example('must set interface before invoking', Error('interface not set'), function () {
        new Application().warn(); // see Interface for more info
      });
    });
    spec.heading('err(text)', function () {
      spec.paragraph('Display info to user in background of primary presentation.');
      spec.example('must set interface before invoking', Error('interface not set'), function () {
        new Application().err(); // see Interface for more info
      });
    });
    spec.heading('ok(prompt, callback)', function () {
      spec.paragraph('Pause before proceeding');
      spec.example('must set interface before invoking', Error('interface not set'), function () {
        new Application().ok();
      });
      spec.example('must provide the text prompt param', Error('prompt required'), function () {
        new Application({interface: new Interface()}).ok();
      });
      spec.example('must provide callback param', Error('callback required'), function () {
        new Application({interface: new Interface()}).ok('You are about to enter the twilight zone.');
      });
    });
    spec.heading('yesno(prompt, callback)', function () {
      spec.paragraph('Query user with a yes no question.');
      spec.example('must set interface before invoking', Error('interface not set'), function () {
        new Application().yesno();
      });
      spec.example('must provide the text question param', Error('prompt required'), function () {
        new Application({interface: new Interface()}).yesno();
      });
      spec.example('must provide callback param', Error('callback required'), function () {
        new Application({interface: new Interface()}).yesno('ok?');
      });
    });
    spec.heading('ask(prompt, attribute, callback)', function () {
      spec.paragraph('Simple single item prompt.');
      spec.example('must set interface before invoking', Error('interface not set'), function () {
        new Application().ask();
      });
      spec.example('must provide the text question param', Error('prompt required'), function () {
        new Application({interface: new Interface()}).ask();
      });
      spec.example('next param is attribute or callback', Error('attribute or callback expected'), function () {
        new Application({interface: new Interface()}).ask('sup');
      });
      spec.example('must provide callback param', Error('callback required'), function () {
        new Application({interface: new Interface()}).
          ask('Please enter your name', new Attribute({name: 'Name'}));
      });
    });
    spec.heading('choose', function () {
      spec.paragraph('prompt to choose an item');
      spec.example('must set interface before invoking', Error('interface not set'), function () {
        new Application().choose();
      });
      spec.example('must provide text prompt first', Error('prompt required'), function () {
        new Application({interface: new Interface()}).choose();
      });
      spec.example('must supply array of choices', undefined, function () {
        var myApplication = new Application({interface: new Interface()});

        this.shouldThrowError(Error('choices array required'), function () {
          myApplication.choose('What it do');
        });
        this.shouldThrowError(Error('choices array required'), function () {
          myApplication.choose('this will not', 'work');
        });
        this.shouldThrowError(Error('choices array empty'), function () {
          myApplication.choose('empty array?', []);
        });
      });
      spec.example('must provide callback param', Error('callback required'), function () {
        var myApplication = new Application();
        myApplication.setInterface(new Interface());
        myApplication.choose('choose wisely', ['rock', 'paper', 'scissors']);
      });
    });
  });
  spec.heading('Application Integration', function () {
    spec.example('minimal app', spec.asyncResults('hello world'), function (callback) {
      // Here is our app
      var ui = new Interface();
      var app = new Application();
      app.setInterface(ui);
      app.start(console.log);
      // define command to satisfy test
      var helloWorldCommand = new Command(function () {
        callback('hello world');
      });
      // mock ui command request - this will get executed by app directly
      ui.mockRequest(new Request({type: 'Command', command: helloWorldCommand}));
    });
    spec.example('little app with command execution mocking', spec.asyncResults(true), function (callback) {
      // todo delamify this
      // Send 4 mocks and make sure we get 4 callback calls
      var self = this;
      self.callbackCount = 0;
      var app = new Application();
      var testInterface = new Interface();
      var testPresentation = new Presentation();
      app.setInterface(testInterface);
      app.setPresentation(testPresentation);
      app.start(function (request) {
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
});

