/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-model.spec.js
 */
spec.test('tgi-core/lib/tgi-core-model.spec.js', 'Model', 'abstracts entities using a collection of attributes', function (callback) {
  spec.testModel(Model, true);
});

/**
 * test Model and Models
 */
spec.testModel = function (SurrogateModel, root) {
  if (!root) {
    spec.mute(true);
  }
  spec.heading('CONSTRUCTOR', function () {
    spec.paragraph('Creation of all Models must adhere to following examples:');
    spec.example('objects created should be an instance of Model', true, function () {
      return new SurrogateModel() instanceof Model;
    });
    spec.example('should make sure new operator used', Error('new operator required'), function () {
      SurrogateModel(); // jshint ignore:line
    });
    spec.example('should make sure properties are valid', Error('error creating Model: invalid property: sup'), function () {
      new SurrogateModel({sup: 'yo'});
    });
    spec.example('can supply attributes in constructor in addition to ID default', 'scrabble', function () {
      var play = new SurrogateModel({attributes: [new Attribute('game')]});
      play.set('game', 'scrabble'); // this would throw error if attribute did not exist
      return play.get('game');
    });
  });
  spec.heading('PROPERTIES', function () {
    spec.heading('tags', function () {
      spec.paragraph('Tags are an array of strings that can be used in searching.');
      spec.example('should be an array or undefined', undefined, function () {
        var m = new SurrogateModel(); // default is undefined
        this.shouldBeTrue(m.tag === undefined && m.getObjectStateErrors().length === 0);
        m.tags = [];
        this.shouldBeTrue(m.getObjectStateErrors().length === 0);
        m.tags = 'your it';
        this.shouldBeTrue(m.getObjectStateErrors().length == 1);
      });
    });
    spec.heading('attributes', function () {
      spec.paragraph('The attributes property is an array of Attributes.');
      spec.example('should be an array', true, function () {
        var goodModel = new SurrogateModel(), badModel = new SurrogateModel();
        badModel.attributes = 'wtf';
        return (goodModel.getObjectStateErrors().length === 0 && badModel.getObjectStateErrors().length == 1);
      });
      spec.example('elements of array must be instance of Attribute', undefined, function () {
        // passing true to getObjectStateErrors() means only check model and not subclass validations
        // todo make unit test for above
        var model = new SurrogateModel();
        model.attributes = [new Attribute("ID", "ID")];
        this.shouldBeTrue(model.getObjectStateErrors(true).length === 0);
        model.attributes = [new Attribute("ID", "ID"), new SurrogateModel(), 0, 'a', {}, [], null];
        this.shouldBeTrue(model.getObjectStateErrors(true).length == 6);
      });
    });
    spec.heading('_', function () {
      spec.example('underscore used form direct access to attribute by name', 'John', function () {
        var attribute = new Attribute('name');
        var model = new SurrogateModel({attributes: [attribute]});
        attribute.value = 'John';
        return model._.name.value;
      });
    });
  });
  spec.heading('METHODS', function () {
    spec.heading('toString()', function () {
      spec.example('should return a description of the model', true, function () {
        return new SurrogateModel().toString().length > 0;
      });
    });
    spec.heading('copy(sourceModel)', function () {
      spec.example('copy all attribute values of a model', undefined, function () {
        var Foo = function (args) {
          Model.call(this, args);
          this.modelType = "Foo";
          this.attributes.push(new Attribute('name'));
        };
        Foo.prototype = inheritPrototype(Model.prototype);
        var m1 = new Foo();
        var m2 = new Foo();
        var m3 = m1;
        m1.set('name', 'Bar');
        m2.set('name', 'Bar');
        // First demonstrate instance ref versus another model with equal attributes
        this.shouldBeTrue(m1 === m3); // assigning one model to variable references same instance
        this.shouldBeTrue(m3.get('name') === 'Bar'); // m3 changed when m1 changed
        this.shouldBeTrue(m1 !== m2); // 2 models are not the same instance
        this.shouldBeTrue(JSON.stringify(m1) === JSON.stringify(m2)); // but they are identical
        // clone m1 into m4 and demonstrate that contents equal but not same ref to object
        var m4 = new Foo();
        m4.copy(m1);
        this.shouldBeTrue(m1 !== m4); // 2 models are not the same instance
        this.shouldBeTrue(JSON.stringify(m1) === JSON.stringify(m4)); // but they are identical
      });
    });
    spec.heading('getObjectStateErrors()', function () {
      spec.example('should return array of validation errors', undefined, function () {
        this.shouldBeTrue(new SurrogateModel().getObjectStateErrors() instanceof Array);
      });
      spec.example('first attribute must be an ID field', 'first attribute must be ID', function () {
        var m = new SurrogateModel();
        m.attributes = [new Attribute('spoon')];
        return m.getObjectStateErrors();
      });
    });
    spec.heading('onEvent', function () {
      spec.paragraph('Use onEvent(events,callback)');
      spec.example('first parameter is a string or array of event subscriptions', Error('subscription string or array required'), function () {
        new SurrogateModel().onEvent();
      });
      spec.example('callback is required', Error('callback is required'), function () {
        new SurrogateModel().onEvent([]);
      });
      spec.example('events are checked against known types', Error('Unknown command event: onDrunk'), function () {
        new SurrogateModel().onEvent(['onDrunk'], function () {
        });
      });
      spec.example('here is a working version', undefined, function () {
        this.log('T.getAttributeEvents()');
        // Validate - callback when attribute needs to be validated
        // StateChange -- callback when state of object (value or validation state) has changed
        new Model().onEvent(['Validate'], function () {
        });
      });
    });
    spec.heading('getShortName', function () {
      spec.example('returns short description of model, defaults to first string attribute', 'Shorty', function () {
        var question = new SurrogateModel({attributes: [new Attribute('name')]});
        question.attributes[1].value = 'Shorty';
        return question.getShortName();
      });
      spec.example('if no string attribute found empty string returned', '', function () {
        // Test for model since models may provide attributes to fail this test
        var question = new Model({attributes: [new Attribute('answer', 'Number')]});
        question.attributes[1].value = 42;
        return question.getShortName();
      });
    });
    spec.heading('getLongName', function () {
      spec.paragraph('note - both getShortName and getLongName should be overriden with method returning desired results when needed.');
      spec.example('return a more verbose name for model than getShortName', 'Shorty', function () {
        var question = new SurrogateModel({attributes: [new Attribute('name')]});
        question.attributes[1].value = 'Shorty';
        return question.getLongName();
      });
    });
    spec.heading('get(attributeName)', function () {
      spec.example('returns undefined if the attribute does not exist', undefined, function () {
        this.shouldBeTrue(new SurrogateModel().get('whatever') === undefined);
      });
      spec.example("returns the value for given attribute", 42, function () {
        var question = new SurrogateModel({attributes: [new Attribute('answer', 'Number')]});
        question.attributes[1].value = 42;
        return question.get('answer');
      });
    });
    spec.heading('getAttributeType(attributeName)', function () {
      spec.example('returns attribute type for given attribute name', 'Date', function () {
        return new SurrogateModel({attributes: [new Attribute('born', 'Date')]}).getAttributeType('born');
      });
    });
    spec.heading('set(attributeName,value)', function () {
      spec.example('throws an error if the attribute does not exists', Error('attribute not valid for model'), function () {
        new SurrogateModel().set('whatever');
      });
      spec.example("sets the value for given attribute", 42, function () {
        var question = new SurrogateModel({attributes: [new Attribute('answer', 'Number')]});
        question.set('answer', 42);
        return question.attributes[1].value;
      });
    });
    spec.heading('validate', function () {
      spec.paragraph('check valid object state and value for attribute - invoke callback for results');
      spec.example('callback is required', Error('callback is required'), function () {
        new Model().validate();
      });
    });
    spec.heading('setError', function () {
      spec.paragraph('Set a error condition and descriptive message');
      spec.example('first argument condition required', Error('condition required'), function () {
        new Model().setError();
      });
      spec.example('second argument description required', Error('description required'), function () {
        new Model().setError('login');
      });
    });
    spec.heading('clearError', function () {
      spec.paragraph('Clear a error condition');
      spec.example('first argument condition required', Error('condition required'), function () {
        new Model().clearError();
      });
    });
  });
  spec.heading('INTEGRATION', function () {
    spec.example('model validation usage demonstrated', spec.asyncResults('test4: 0'), function (callback) {

      // Create a model with each attribute having and error
      var model = new Model({
        attributes: [
          new Attribute({name: 'Name', validationRule: {required: true}}),
          new Attribute({name: 'Age', type: 'Number', validationRule: {range: [18, null]}}),
          new Attribute({name: 'Sex', validationRule: {required: true}})
        ]
      });

      model.setError('danger', 'Danger Will Robinson');

      // Create a model validation where males have to be 21
      model.onEvent('Validate', function () {
        var name = model.get('name');
        var age = model.get('age');
        var sex = model.get('sex');
        if (sex != 'F' && age < 21)
          model.validationErrors.push('Males must be 21 or over');
      });
      model.validate(test1);

      // Expect 1 error from B9 Robot (Attribute errors ignored if model state error)
      function test1() {
        if (model.validationErrors.length == 1) {
          model.clearError('danger');
          model.validate(test2);
        } else {
          callback('test1: ' + model.validationErrors.length);
        }
      }

      // Expect 3 errors for each attribute
      function test2() {
        if (model.validationErrors.length == 3) {
          model.set('name', 'John Doe');
          model.set('age', 18);
          model.set('sex', 'M');
          model.validate(test3);
        } else {
          callback('test2: ' + model.validationErrors.length);
        }
      }

      // Expect 1 errors since all attributes fixed but model will fail
      function test3() {
        if (model.validationErrors.length == 1 && model.validationMessage == 'Males must be 21 or over') {
          model.set('age', 21);
          model.validate(test4);
        } else {
          callback('test3: ' + model.validationErrors.length);
        }
      }

      // Test done should be no errors (to pass final test)
      function test4() {
        callback('test4: ' + model.validationErrors.length);
      }
    });
  });
  if (SurrogateModel.modelType != 'Model') {
    var wasMuted = spec.mute(false).testsCreated;
    spec.paragraph('*' + wasMuted + ' model tests applied*');
  }
};
