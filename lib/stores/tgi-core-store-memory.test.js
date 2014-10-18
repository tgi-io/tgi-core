/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/stores/tgi-core-store-memory.test.js
 */
spec.test('tgi-core/lib/stores/tgi-core-store-memory.test.js', 'Memory', '<insert description>', function (callback) {
  spec.heading('MemoryStore', function () {
    spec.paragraph('The MemoryStore is a simple volatile store. ' +
      'It is the first test standard to define the spec for all Stores to follow.');
    spec.heading('CONSTRUCTOR', function () {
      spec.heading('Store Constructor tests are applied', function () {
        spec.runnerStoreConstructor(MemoryStore);
      });
      spec.example('objects created should be an instance of MemoryStore', true, function () {
        return new MemoryStore() instanceof MemoryStore;
      });
    });
    spec.heading('Store tests are applied', function () {
      spec.runnerStoreMethods(MemoryStore);
    });
  });
});
