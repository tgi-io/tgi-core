/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/models/tgi-core-model-application.test.js
 */
spec.test('tgi-core/lib/models/tgi-core-model-application.spec.js', 'Application', '<insert description>', function (callback) {
  spec.heading('Application Model', function () {
    spec.paragraph('Information about the application is modeled here.');
    spec.heading('CONSTRUCTOR', function () {
      spec.example('objects created should be an instance of Application', true, function () {
        return new Application() instanceof Application;
      });
      spec.heading('Model tests are applied', function () {
        spec.testModel(Application);
      });
    });
    spec.heading('ATTRIBUTES', function () {
      spec.paragraph('Application extends model and inherits the attributes property.  All Presentation objects ' +
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
        spec.example('callback parameter required', Error('callBack required'), function () {
          var app = new Application();
          app.setInterface(new Interface());
          app.start();
        });
      });
      spec.heading('dispatch()', function () {
        spec.paragraph('The dispatch method will accept a request and act on it or pass it to the app.');
        spec.example('must pass a Request object', Error('Request required'), function () {
          new Application().dispatch();
        });
        spec.example('send command without callback when no response needed', undefined, function () {
          new Application().dispatch(new Request({type: 'Command', command: new Command()}));
        });
        spec.example('optional second parameter is the response callback', Error('response callback is not a function'), function () {
          new Application().dispatch(new Request({type: 'Command', command: new Command()}), true);
        });
      });
    });
    //spec.runnerApplicationIntegration();
  });
});