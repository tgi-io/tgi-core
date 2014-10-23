/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-request.spec.js
 */
spec.test('tgi-core/lib/tgi-core-request.spec.js', 'Request', 'from Interface - Application handles response', function (callback) {
  spec.paragraph('Requests handle the Request / Response design pattern.  They are used by the Interface class to ' +
  'communicate with the Application Model');
  spec.heading('CONSTRUCTOR', function () {
    spec.example('objects created should be an instance of Request', true, function () {
      return new Request('Null') instanceof Request;
    });
    spec.example('should make sure new operator used', Error('new operator required'), function () {
      Request('Null'); // jshint ignore:line
    });
    spec.example('request type must be specified', Error('Request type required'), function () {
      new Request();
    });
    spec.example('simple string parameter creates request of named type', 'example', function () {
      return new Request('example').type;
    });
    spec.example('type can be specified when object passed', 'example', function () {
      return new Request({type: 'example'}).type;
    });
    spec.example('Command type requests expect contents to contain a command object', Error('command object required'), function () {
      return new Request({type: 'Command'});
    });
    spec.example('correct version', 'Command Request: Stub Command: (unnamed)', function () {
      return new Request({type: 'Command', command: new Command()});
    });
  });
  spec.heading('METHODS', function () {
    spec.heading('toString()', function () {
      spec.example('should return a description of the Request', 'Null Request', function () {
        return new Request('Null').toString();
      });
    });
  });
});
