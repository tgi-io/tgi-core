/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core-text.spec.js
 */
spec.test('tgi-core/lib/core/tgi-core-text.spec.js', 'Text', 'text identifier allows interface info', function (callback) {
  spec.heading('Text Class', function () {
    spec.paragraph('Text is used to allow display and setting of application / user text.');
    spec.heading('CONSTRUCTOR', function () {
      spec.example('objects created should be an instance of Text', true, function () {
        return new Text('Null') instanceof Text;
      });
      spec.example('should make sure new operator used', Error('new operator required'), function () {
        Text('Null'); // jshint ignore:line
      });
    });
    spec.heading('METHODS', function () {
      spec.heading('toString()', function () {
        spec.example('should return a description of the Text', 'Text: \'me\'', function () {
          return new Text('me').toString();
        });
      });
    });
  });
});
