/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core.test.js
 **/
spec.test('tgi-core/lib/tgi-core.test.js', 'Core Library', function (callback) {
  callback({log: 'tgi-core/lib/tgi-core.test.js'});
  spec.heading('TGI CORE', function () {
    spec.paragraph('Core Objects.');
    spec.example('CORE function exposes library', 'function', function () {
      return typeof CORE;
    });
    spec.example('UTILITY functions are available in closure', 'function', function () {
      return typeof inheritPrototype;
    });
  });
});
