/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core.test.js
 **/
/**
 * Doc Intro
 */
spec.test('lib/tgi-spec-intro', 'tgi-core', 'Core Repository for TGI Framework', function (callback) {
  spec.paragraph('Core objects, models, stores and interfaces for the TGI framework.');
  spec.index();
});
spec.test('tgi-core/lib/tgi-core.test.js', 'CORE', 'exposed as public or exported (node)', function (callback) {
  spec.paragraph('-tgi-core- objects are encapsulated in a namespace returned by the CORE function');
  spec.example('CORE function exposes library', 'function', function () {
    return typeof CORE;
  });
  spec.example('UTILITY functions are available in closure', 'function', function () {
    return typeof inheritPrototype;
  });
});
