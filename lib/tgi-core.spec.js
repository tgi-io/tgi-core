/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core.spec.js
 **/
spec.test('lib/tgi-spec-intro', 'tgi-core', 'Core Repository', function (callback) {
  spec.paragraph('Core constructors, models, stores and interfaces.  The constructor functions define the object ' +
  '"classes" used by the framework.  The Model Constructor is a key part of the core that defines the system ' +
  'functionality for the framework.  The framework is further extended with a Store and Interface abstract that ' +
  'provides data stores and ui/ux implementations.');
  spec.example('CORE function exposes library', 'function', function () {
    return typeof CORE;
  });
  spec.index('##Constructors');
});
