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
  spec.paragraph('The CORE function exposes the tgi-core library via global or node module exports.');
  spec.example('CORE function exposes library', 'function', function () {
    return typeof CORE;
  });
  spec.paragraph('Application code written in the TGI Framework does not need the CORE function since it is' +
  'visible by closure.');
  spec.example('core object Model is available in closure', undefined, function () {
    this.shouldBeTrue(Model == CORE().Model);
  });
  spec.example('UTILITY functions are available in closure', '******* sup ********', function () {
    // https://github.com/tgicloud/tgi-utility
    return cpad(' sup ',20,'*');
  });
});
