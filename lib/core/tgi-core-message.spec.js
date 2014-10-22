/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-message.spec.js
 */
spec.test('tgi-core/lib/tgi-core-message.spec.js', 'Message', 'between host and client', function (callback) {
  spec.heading('Message Class', function () {
    spec.paragraph('Messages are used by Transport to send to host or UI.');
    spec.heading('CONSTRUCTOR', function () {
      spec.example('objects created should be an instance of Message', true, function () {
        return new Message('Null') instanceof Message;
      });
      spec.example('should make sure new operator used', Error('new operator required'), function () {
        Message('Null'); // jshint ignore:line
      });
      spec.example('first parameter is required', Error('message type required'), function () {
        new Message();
      });
      spec.example('first parameter must be valid message type', Error('Invalid message type: http://www.youtube.com/watch?v=2o7V1f7lbk4'), function () {
        new Message('http://www.youtube.com/watch?v=2o7V1f7lbk4');
      });
    });
    spec.heading('METHODS', function () {
      spec.heading('toString()', function () {
        spec.example('should return a description of the message', 'Null Message', function () {
          return new Message('Null').toString();
        });
      });
      spec.heading('Attribute.getTypes', function () {
        spec.paragraph('This helper function returns an array of valid Message types.  This is just a function - not a prototype method.');
        spec.example('show the types', undefined, function () {
          this.log(Message.getTypes());
        });
      });
    });
  });
});
