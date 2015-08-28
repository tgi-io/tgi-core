/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core.spec.js
 **/
spec.test('lib/tgi-spec-intro', 'tgi-core', 'Core Repository', function (callback) {
  spec.paragraph('Core constructors, models, stores and interfaces.  The constructor functions define the object ' +
  '"classes" used by the framework.  The Model Constructor is a key part of the core that defines the system ' +
  'functionality for the framework.  The framework is further extended with a Store and Interface abstract that ' +
  'provides data store and user interface vendor implementations.');
  spec.example('TGI.CORE function exposes library', undefined, function () {
    this.log(TGI.CORE().version);
  });
  spec.index('##Constructors');
});
