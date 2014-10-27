/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/models/tgi-core-model-user.test.js
 */
spec.test('tgi-core/lib/models/tgi-core-model-user.spec.js', 'User', 'access, logging and other stuff todo with humans', function (callback) {
  spec.heading('User Model', function () {
    spec.paragraph('The User Model represents the user logged into the system. The library uses this for system' +
      ' access, logging and other functions.');
    spec.heading('CONSTRUCTOR', function () {
      spec.example('objects created should be an instance of User', true, function () {
        return new User() instanceof User;
      });
      spec.heading('Model tests are applied', function () {
        spec.testModel(User, true);
      });
    });
    spec.heading('ATTRIBUTES', function () {
      spec.example('following attributes are defined:', undefined, function () {
        var user = new User(); // default attributes and values
        this.shouldBeTrue(user.get('id') === null);
        this.shouldBeTrue(user.get('name') === null);
        this.shouldBeTrue(user.get('active') === false);
        this.shouldBeTrue(user.get('password') === null);
        this.shouldBeTrue(user.get('firstName') === null);
        this.shouldBeTrue(user.get('lastName') === null);
        this.shouldBeTrue(user.get('email') === null);
      });
    });
  });
});
