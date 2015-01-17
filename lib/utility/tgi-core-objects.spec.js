/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/utility/tgi-core-objects.spec.js
 */
spec.test('tgi-utility/lib/tgi-utility-objects.test.js', 'Object Functions', 'description', function (callback) {
  spec.heading('inheritPrototype(p)', function () {
    spec.paragraph('kinda sorta class like');
    spec.example('Cannot pass null', undefined, function () {
      this.shouldThrowError('*', function () {
        inheritPrototype(null);
      });
    });
    spec.example('quack like a duck', 'quack', function () {
      // Duck class
      var Duck = function () {
      };
      // Duck method
      Duck.prototype.sound = function () {
        return 'quack';
      };
      // Mallard class
      var Mallard = function () {
      };
      // Mallard inherits Duck prototype
      Mallard.prototype = inheritPrototype(Duck.prototype);
      // Create instance
      var daffy = new Mallard();

      // Instance of constructor & the inherited prototype's class fir daffy
      this.shouldBeTrue(daffy instanceof Mallard);
      this.shouldBeTrue(daffy instanceof Duck);

      // What sound does daffy make?
      return daffy.sound();
    });
  });
  spec.heading('getInvalidProperties(args,allowedProperties)', function () {
    spec.paragraph('Functions that take an object as it\'s parameter use this to validate the ' +
    'properties of the parameter by returning any invalid properties');
    spec.example('valid property', 'Kahn', function () {
      // got Kahn and value backwards so Kahn is an unknown property
      return getInvalidProperties({name: 'name', Kahn: 'value'}, ['name', 'value'])[0];
    });
    spec.example('invalid property', 0, function () {
      // no unknown properties
      return getInvalidProperties({name: 'name', value: 'Kahn'}, ['name', 'value']).length;
    });
  });
});
