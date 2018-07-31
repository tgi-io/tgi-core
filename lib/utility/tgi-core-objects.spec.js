/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/utility/tgi-core-objects.spec.js
 */
spec.test('tgi-utility/lib/tgi-utility-objects.test.js', 'Object Functions', 'description', function (callback) {
  spec.heading('inheritPrototype(p)', function () {
    spec.paragraph('[deprecated] ex: User.prototype = Object.create(Model.prototype);');
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
  spec.heading('getConstructorFromModelType(modelType)', function () {
    spec.example('returns Model constructor if type not registered', Model, function () {
      return getConstructorFromModelType();
    });
    spec.example('registered models return the constructor function', User, function () {
      return getConstructorFromModelType('User');
    });
    spec.example('objects created utilize proper constructor', false, function () {
      var ProxyModel = getConstructorFromModelType('User');
      var proxyModel = new ProxyModel();
      return proxyModel.get('active');
    });
    spec.example('Core models are known', undefined, function () {
      this.shouldBeTrue(getConstructorFromModelType('User') == User);
      this.shouldBeTrue(getConstructorFromModelType('Session') == Session);
      this.shouldBeTrue(getConstructorFromModelType('Workspace') == Workspace);
      this.shouldBeTrue(getConstructorFromModelType('Presentation') == Presentation);
      this.shouldBeTrue(getConstructorFromModelType('Log') == Log);
      this.shouldBeTrue(getConstructorFromModelType('Application') == Application);
    });
  });
  spec.heading('createModelFromModelType', function () {
    spec.example('returns instance of Model if type not registered', 'Model', function () {
      return createModelFromModelType().modelType;
    });
    spec.example('objects created utilize proper constructor', false, function () {
      return createModelFromModelType('User').get('active');
    });
  });
  spec.heading('getObjectFromCPON', function () {
    spec.paragraph('A character string with representing object with pipe (|) delineating members and caret (^) delineating key from value.');
    spec.example('expects a string with CPON data', 'I\'m just a a cook.', function () {
      this.shouldThrowError(Error('expected CPON string'), function () {
        getObjectFromCPON();
      });
      this.shouldThrowError(Error('caret (^) not found in garden'), function () {
        getObjectFromCPON('garden');
      });
      this.shouldBeTrue(getObjectFromCPON('x^1') instanceof Object);
      this.shouldBeTrue(getObjectFromCPON('abc^123').abc === '123');
      this.shouldBeTrue(getObjectFromCPON('x^1|y^2').x === '1');
      this.shouldBeTrue(getObjectFromCPON('x^1|y^2').y === '2');
      return getObjectFromCPON('name^Sean|age^57|job^I\'m just a a cook.').job;
    });
  });
});
