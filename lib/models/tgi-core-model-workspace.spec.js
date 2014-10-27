/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/models/tgi-core-model-workspace.test.js
 */
spec.test('tgi-core/lib/models/tgi-core-model-workspace.spec.js', 'Workspace', 'of active Models for user', function (callback) {
  spec.heading('Workspace Model', function () {
    spec.paragraph('A workspace is a collection of active deltas for a user.  The GUI could represent that as open' +
      'tabs for instance.  Each tab a model view.  The deltas represent the change in model state');
    spec.heading('CONSTRUCTOR', function () {
      spec.example('objects created should be an instance of Workspace', true, function () {
        return new Workspace() instanceof Workspace;
      });
      spec.heading('Model tests are applied', function () {
        spec.testModel(Workspace, true);
      });
    });
    spec.heading('ATTRIBUTES', function () {
      spec.example('following attributes are defined:', undefined, function () {
        var user = new Workspace(); // default attributes and values
        this.shouldBeTrue(user.get('id') !== undefined);
        this.shouldBeTrue(user.get('user') instanceof Attribute.ModelID);
        this.shouldBeTrue(user.get('user').modelType == 'User');
        this.shouldBeTrue(typeof user.get('deltas') == 'object');
      });
    });
    spec.heading('METHODS', function () {
      spec.paragraph('loadUserWorkspace(user, callBack)');
      spec.paragraph('sync');
    });
    spec.heading('INTEGRATION', function () {
      //spec.example('Workspace usage', undefined, function () {
      //});
    });
  });
});