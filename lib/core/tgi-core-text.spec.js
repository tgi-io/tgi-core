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
    spec.heading('get()', function () {
      spec.example('return value', 'yo', function () {
        return new Text('yo').get();
      });
    });
    spec.heading('set()', function () {
      spec.example('set value', 'You', function () {
        var who = new Text('Me');
        who.set('You');
        return who.get();
      });
    });
    spec.heading('onEvent', function () {
      spec.paragraph('Use onEvent(events,callback)');
      spec.example('first parameter is a string or array of event subscriptions', Error('subscription string or array required'), function () {
        new Text('').onEvent();
      });
      spec.example('callback is required', Error('callback is required'), function () {
        new Text('').onEvent([]);
      });
      spec.example('events are checked against known types', Error('Unknown command event: onDrunk'), function () {
        new Text('').onEvent(['onDrunk'], function () {
        });
      });
      spec.example('here is a working version', undefined, function () {
        new Text('').onEvent(['StateChange'], function () {
        });
      });
    });
    spec.heading('offEvents', function () {
      spec.paragraph('Free all onEvent listeners');
      spec.example('example', undefined, function () {
        new Text('').offEvent();
      });
    });

  });
});
