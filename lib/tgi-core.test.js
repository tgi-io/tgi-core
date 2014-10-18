/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core.test.js
 **/
/**
 * Doc Intro
 */
spec.test('lib/tgi-spec-intro', 'tgi-core', 'Core Repository for TGI Framework', function (callback) {
  spec.paragraph('Core objects, models, stores and interfaces for the TGI framework.');
  spec.heading('Table of Contents', function () {
    spec.index();
  });
});
spec.test('tgi-core/lib/tgi-core.test.js', 'CORE', 'exposed as public or exported (node)', function (callback) {
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
