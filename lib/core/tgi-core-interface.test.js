/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-interface.spec.js
 */
spec.test('tgi-core/lib/tgi-core-interface.spec.js', 'Interface', function (callback) {
  var SurrogateInterface = Interface;
  spec.heading('Interface Class', function () {
    spec.heading('CONSTRUCTOR', function () {
      spec.example('objects created should be an instance of SurrogateInterface', true, function () {
        var i = new SurrogateInterface();
        return (i instanceof SurrogateInterface) && (i instanceof Interface);
      });
      spec.example('should make sure new operator used', Error('new operator required'), function () {
        SurrogateInterface(); // jshint ignore:line
      });
      spec.example('should make sure argument properties are valid', Error('error creating Procedure: invalid property: yo'), function () {
        new SurrogateInterface({yo: 'whatup'});
      });
    });
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
        spec.example('should return a description of the message', 'Punched Card SurrogateInterface', function () {
          return new SurrogateInterface({description: 'Punched Card SurrogateInterface'}).toString();
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
        spec.paragraph('The notify method sends a Request to the Interface.  This can be the result of a request sent from the start() callback.');
        spec.example('must pass a Request object', Error('Request required'), function () {
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
    });
    //spec.runnerInterfaceIntegration();
  });
});
