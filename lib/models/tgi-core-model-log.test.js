/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/models/tgi-core-model-log.test.js
 */
spec.test('tgi-core/lib/models/tgi-core-model-log.test.js', 'Log', function (callback) {
  spec.heading('Log Model', function () {
    spec.paragraph('Multi purpose log model.');
    spec.heading('CONSTRUCTOR', function () {
      spec.example('objects created should be an instance of Workspace', true, function () {
        return new Log() instanceof Log;
      });
      spec.heading('Model tests are applied', function () {
        spec.testModel(Log);
      });
      spec.heading('ATTRIBUTES', function () {
        spec.example('following attributes are defined:', undefined, function () {
          var log = new Log('what up'); // default attributes and values
          this.shouldBeTrue(log.get('id') !== undefined);
          this.shouldBeTrue(log.get('dateLogged') instanceof Date);
          //spec.show(log.get('dateLogged'));
          this.shouldBeTrue(log.get('logType') == 'Text');
          this.shouldBeTrue(log.get('importance') == 'Info');
          this.shouldBeTrue(log.get('contents') == 'what up');
        });
      });
      spec.heading('LOG TYPES', function () {
        spec.example('must be valid', Error('Unknown log type: wood'), function () {
          //spec.show(T.getLogTypes());
          new Log({logType: 'wood'}); // default attributes and values
        });
        spec.example('Text simple text message', 'Info: sup', function () {
          return new Log('sup');
        });
        spec.example('Delta logged Delta (see in Core)', 'Info: (delta)', function () {
          var delta = new Delta(new Attribute.ModelID(new Model()));
          return new Log({logType: 'Delta', contents: delta}).toString();
        });
      });
    });
  });
});
