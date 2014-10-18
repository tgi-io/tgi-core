/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/models/tgi-core-model-presentation.test.js
 */
spec.test('tgi-core/lib/models/tgi-core-model-presentation.test.js', 'Presentation', '<insert description>', function (callback) {
  spec.heading('Presentation Model', function () {
    spec.paragraph('The Presentation Model represents the way in which a model is to be presented to the user.  ' +
    'The presentation is meant to be a "hint" to a Interface object.  ' +
    'The specific Interface object will represent the model data according to the Presentation object.');
    spec.heading('CONSTRUCTOR', function () {
      spec.example('objects created should be an instance of Presentation', true, function () {
        return new Presentation() instanceof Presentation;
      });
      spec.heading('Model tests are applied', function () {
        spec.testModel(Presentation);
      });
    });
    spec.heading('PROPERTIES', function () {
      spec.heading('model', function () {
        spec.paragraph('This is a model instance for the presentation instance.');
      });
      spec.heading('validationErrors', function () {
        spec.example('Array of errors', undefined, function () {
          this.shouldBeTrue(new Presentation().validationErrors instanceof Array);
          this.shouldBeTrue(new Presentation().validationErrors.length === 0);
        });
      });
      spec.heading('validationMessage', function () {
        spec.example('string description of error(s)', '', function () {
          return new Presentation().validationMessage;
        });
      });
    });
    spec.heading('ATTRIBUTES', function () {
      spec.paragraph('Presentation extends model and inherits the attributes property.  All Presentation objects ' +
      'have the following attributes:');
      spec.example('following attributes are defined:', undefined, function () {
        var presentation = new Presentation(); // default attributes and values
        this.shouldBeTrue(presentation.get('id') === null);
        this.shouldBeTrue(presentation.get('name') === null);
        this.shouldBeTrue(presentation.get('modelName') === null);
        this.shouldBeTrue(presentation.get('contents') instanceof Array);
      });
    });
    spec.heading('METHODS', function () {
      spec.heading('modelConstructor', function () {
        spec.paragraph('This is a reference to the constructor function to create a new model');
        //spec.xexample('', undefined, function () {
        //});
      });
      spec.heading('validate', function () {
        spec.paragraph('check valid object state then extend to presentation contents');
        spec.example('callback is required -- see integration', Error('callback is required'), function () {
          new Presentation().validate();
        });
      });
    });
    spec.heading('CONTENTS', function () {
      spec.paragraph('The contents attributes provides the structure for the presentation.');
      spec.example('content must be an array', 'contents must be Array', function () {
        var pres = new Presentation();
        pres.set('contents', true);
        return pres.getObjectStateErrors();
      });
      spec.example('array elements must be Command , Attribute or String', 'contents elements must be Command, Attribute or string', function () {
        var pres = new Presentation();
        // strings with prefix # are heading, a dash - by itself is for a visual separator
        pres.set('contents', ['#heading', new Command(), new Attribute({name: 'meh'})]);
        this.shouldBeTrue(pres.getObjectStateErrors().length === 0);
        pres.set('contents', [new Command(), new Attribute({name: 'meh'}), true]);
        return pres.getObjectStateErrors();
      });
    });
    spec.heading('INTEGRATION', function () {

      spec.example('validation usage demonstrated', spec.asyncResults('contents has validation errors'), function (callback) {
        var attribute = new Attribute({name: 'test'});
        var presentation = new Presentation(); // default attributes and values
        presentation.set('contents', [
          attribute
        ]);
        attribute.setError('test', 'test error');
        presentation.validate(function () {
          callback(presentation.validationMessage);
        });
      });

    });
  });
});
