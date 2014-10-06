/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-attribute.spec.js
 */
spec.test('tgi-core/lib/tgi-core-attribute.spec.js', 'Spec Constructor Function', function (callback) {
  callback({log: 'tgi-core/lib/tgi-core-attribute.spec.js'});

  spec.heading('Attribute Class', function () {
    spec.paragraph('Attributes are the means for models to represent data of different types.  They have no' +
    ' dependencies on Models however and can be used without creating a model.');
    spec.heading('CONSTRUCTOR', function () {
      spec.example('objects created should be an instance of Attribute', true, function () {
        return new Attribute({name: 'name'}) instanceof Attribute;
      });
      /*
      spec.example('should make sure new operator used', Error('new operator required'), function () {
        Attribute({name: 'name'});
      });
      spec.example('should make sure properties are valid', Error('error creating Attribute: invalid property: sex'), function () {
        new Attribute({name: 'name', sex: 'female'});
      });
      spec.example('should validate and throw errors before returning from constructor', Error('error creating Attribute: multiple errors'), function () {
        new Attribute({eman: 'the'}); // 2 errors: name missing and eman an unknown property
      });
      spec.heading('Attribute.ModelID', function () {
        spec.paragraph('Attribute.ModelID defines reference to ID in external model.');
        spec.example('objects created should be an instance of Attribute.ModelID', true, function () {
          return new Attribute.ModelID(new Model()) instanceof Attribute.ModelID;
        });
        spec.example('should make sure new operator used', Error('new operator required'), function () {
          Attribute.ModelID();
        });
        spec.example('constructor must pass instance of model', Error('must be constructed with Model'), function () {
          new Attribute.ModelID();
        });
        spec.example('value is set to value of ID in constructor', 123, function () {
          var model = new Model();
          model.set('id', 123);
          return new Attribute.ModelID(model).value;
        });
        spec.example('constructorFunction is set to constructor of model', true, function () {
          var model = new Model();
          model.set('id', 123);
          var attrib = new Attribute.ModelID(model);
          var newModel = new attrib.constructorFunction();
          return newModel instanceof Model;
        });
        spec.example('modelType is set from model in constructor', 'Model', function () {
          return new Attribute.ModelID(new Model()).modelType;
        });
        spec.example('toString is more descriptive', "ModelID(Model:123)", function () {
          var model = new Model();
          model.set('id', 123);
          return new Attribute.ModelID(model).toString();
        });
      });
      */
    });
    /*
    spec.heading('PROPERTIES', function () {
      spec.heading('name', function () {
        spec.example('should be required', Error('error creating Attribute: name required'), function () {
          new Attribute();
        });
        spec.example('should allow shorthand string constructor for name property', 'Attribute: favoriteActorName', function () {
          return new Attribute('favoriteActorName');
        });
      });
      spec.heading('type', function () {
        spec.example("should default to 'String'", 'String', function () {
          return new Attribute({name: 'name'}).type;
        });
        spec.example('should be a valid attribute type', Error('error creating Attribute: Invalid type: Dude'), function () {
          spec.show(T.getAttributeTypes());
          new Attribute({name: 'Bogus', type: "Dude"});
        });
        spec.example('should allow shorthand string constructor for type property', 'Date', function () {
          return new Attribute('favoriteActorBorn', 'Date').type;
        });
      });
      spec.heading('label', function () {
        spec.example('should default to name property capitalized', 'Name', function () {
          return new Attribute({name: 'name'}).label;
        });
        spec.example('should be optional in constructor', 'Name', function () {
          return new Attribute({name: 'name', label: 'Name'}).label;
        });
      });
      spec.heading('placeHolder', function () {
        spec.example('pass through to Interface used as visual cue to user for input', '###-##-####', function () {
          return new Attribute({name: 'ssn', placeHolder: '###-##-####'}).placeHolder;
        });
      });
      spec.heading('hint', function () {
        spec.paragraph('hint properties give guidance in handling of the attribute');
        spec.example('initialized to empty object', 'object', function () {
          return typeof new Attribute({name: 'name', label: 'Name'}).hint;
        });
      });
      spec.heading('quickPick', function () {
        spec.example('list of values to pick from typically invoked from dropdown', 3, function () {
          return new Attribute({name: 'stooge', quickPick: ['moe', 'larry', 'curly']}).quickPick.length;
        });
      });
      spec.heading('validationErrors', function () {
        spec.example('Array of errors', undefined, function () {
          spec.assertion(new Attribute({name: 'name'}).validationErrors instanceof Array);
          spec.assertion(new Attribute({name: 'name'}).validationErrors.length == 0);
        });
      });
      spec.heading('validationMessage', function () {
        spec.example('string description of error(s)', '', function () {
          return new Attribute({name: 'name'}).validationMessage;
        });
      });
      spec.heading('validationRule', function () {
        spec.paragraph('The validationRule property provides validation rules for attribute.' +
        '  For additional validation see the *Validate* event in onEvent method.');
        spec.example('initialized to empty object', 'object', function () {
          return typeof new Attribute({name: 'name'}).validationRule;
        });
        spec.example('can be passed to constructor', undefined, function () {
          new Attribute({name: 'name', validationRule: {}});
        });
        spec.example('validation rule is validated', Error('error creating Attribute: invalid validationRule: age'), function () {
          new Attribute({name: 'name', validationRule: {age: 18, required: true}});
        });
        spec.heading('validationRule.required', function () {
          spec.paragraph('validationRule.required is used when a value is required for attribute');
          spec.example('validationRule.required', spec.asyncResponse('Name required'), function (testNode, returnResponse) {
            var a = new Attribute({name: 'name', validationRule: {required: true}});
            a.validate(function () {
              returnResponse(testNode, a.validationErrors);
            });
          });
          spec.example('validationRule.required for Number allows 0', spec.asyncResponse(0), function (testNode, returnResponse) {
            var a = new Attribute({name: 'balance', type: 'Number', value: 0, validationRule: {required: true}});
            a.validate(function () {
              returnResponse(testNode, a.validationErrors.length);
            });
          });
          spec.example('validationRule.required for Boolean allows false', spec.asyncResponse(0), function (testNode, returnResponse) {
            var a = new Attribute({name: 'active', type: 'Boolean', value: false, validationRule: {required: true}});
            a.validate(function () {
              returnResponse(testNode, a.validationErrors.length);
            });
          });
        });
        spec.heading('validationRule.range', function () {
          spec.paragraph('validationRule.range is used when value must fall within a range of values- use null to omit bound');
          spec.example('validationRule.range lower bound only', spec.asyncResponse('Age must be at least 18'), function (testNode, returnResponse) {
            var a = new Attribute({name: 'age', type: 'Number', value: 17, validationRule: {range: [18, null]}});
            a.validate(function () {
              returnResponse(testNode, a.validationErrors[0]);
            });
          });
          spec.example('validationRule.range upper bound only', spec.asyncResponse('Age must be no more than 65'), function (testNode, returnResponse) {
            var a = new Attribute({name: 'age', type: 'Number', value: 77, validationRule: {range: [null, 65]}});
            a.validate(function () {
              returnResponse(testNode, a.validationErrors[0]);
            });
          });
          spec.example('validationRule.range pass', spec.asyncResponse(0), function (testNode, returnResponse) {
            var a = new Attribute({name: 'age', type: 'Number', value: 53, validationRule: {range: [18, 65]}});
            a.validate(function () {
              returnResponse(testNode, a.validationErrors.length);
            });
          });
          spec.example('validationRule.range forced to array', spec.asyncResponse('Age must be at least 100'), function (testNode, returnResponse) {
            var a = new Attribute({name: 'age', type: 'Number', value: 53, validationRule: {range: 100}});
            a.validate(function () {
              returnResponse(testNode, a.validationErrors);
            });
          });
        });
        spec.heading('validationRule.isOneOf', function () {
          spec.paragraph('validationRule.isOneOf is used when a value is must be on of items in array');

          spec.example('validationRule.isOneOf fail', spec.asyncResponse('Age invalid'), function (testNode, returnResponse) {
            var a = new Attribute({name: 'age', type: 'Number', value: 2, validationRule: {isOneOf: [1, 3]}});
            a.validate(function () {
              returnResponse(testNode, a.validationErrors[0]);
            });
          });
          spec.example('validationRule.isOneOf pass', spec.asyncResponse(0), function (testNode, returnResponse) {
            var a = new Attribute({name: 'age', type: 'Number', value: 1, validationRule: {isOneOf: [1, 3]}});
            a.validate(function () {
              returnResponse(testNode, a.validationErrors.length);
            });
          });
        });

      });
      spec.heading('value', function () {
        spec.example('should accept null assignment', undefined, function () {
          var myTypes = T.getAttributeTypes();
          var record = '';
          for (var i = 0; i < myTypes.length; i++) {
            record += myTypes[i] + ':' + new Attribute({name: 'my' + myTypes[i]}).value + ' ';
          }
          spec.show(record);
          // It's the default and it passes constructor validation
        });
        spec.example('should accept assignment of correct type and validate incorrect attributeTypes',
          '7 correct assignments 91 errors thrown', function () {
            // Test all known attribute types
            var myTypes = T.getAttributeTypes();
            myTypes.shift(); // not testing ID
            myTypes.pop(); // not testing Object since it matches other types
            spec.show(myTypes);
            spec.show(T.getAttributeTypes());

            // Now create an array of matching values for each type into myValues
            var myModel = new Model();
            var myGroup = new Attribute({name: 'columns', type: 'Group', value: [new Attribute("Name")]});
            var myTable = new Attribute({name: 'bills', type: 'Table', group: myGroup });
            var myValues = ['Jane Doe', new Date, true, 18, new Attribute.ModelID(new Model()), [], myTable];

            // Loop thru each type
            var theGood = 0;
            var theBad = 0;
            for (var i = 0; i < myTypes.length; i++)
              for (var j = 0; j < myValues.length; j++) {
                // for the value that works it won't throw error just create and to test
                if (i == j) {
                  theGood++;
                  switch (myTypes[i]) {
                    case 'Table':
                      new Attribute({name: 'my' + myTypes[i], type: myTypes[i], value: myValues[j], group: myGroup});
                      break;
                    default:
                      new Attribute({name: 'my' + myTypes[i], type: myTypes[i], value: myValues[j] });
                      break;
                  }
                } else {
                  // mismatches bad so should throw error (is caught unless no error or different error)
                  theBad++;
                  spec.shouldThrow('*', function () {
                    new Attribute({name: 'my' + myTypes[i], type: myTypes[i], value: myValues[j]});
                  });
                }
                // other objects should throw always
                theBad++;
                spec.shouldThrow('*', function () {
                  new Attribute({name: 'my' + myTypes[i], type: myTypes[i], value: {} });
                });
              }
            return theGood + ' correct assignments ' + theBad + ' errors thrown';
          });
      });
    });
    spec.heading('TYPES', function () {
      spec.heading('ID', function () {
        spec.example("should have type of 'ID'", 'ID', function () {
          return new Attribute({name: 'CustomerID', type: 'ID'}).type;
        });
      });
      spec.heading('String', function () {
        spec.example("should have type of 'String'", 'String', function () {
          return new Attribute({name: 'Cheese', type: 'String'}).type;
        });
        spec.example('should have size property', 10, function () {
          // Note: size property is not "enforced" but for formatting purposes
          return new Attribute({name: 'zipCode', size: 10}).size;
        });
        spec.example('size should default to 50', 50, function () {
          return new Attribute({name: 'stuff'}).size;
        });
        spec.example('size should be an integer', 'Error: error creating Attribute: size must be a number from 1 to 255', function () {
          new Attribute({name: 'zipCode', size: "10"});
        });
        spec.example('size should be between 1 and 255', undefined, function () {
          spec.shouldThrow(Error('error creating Attribute: size must be a number from 1 to 255'), function () {
            new Attribute({name: 'partyLikeIts', size: 1999});
          });
          spec.shouldThrow(Error('error creating Attribute: size must be a number from 1 to 255'), function () {
            new Attribute({name: 'iGotNothing', size: 0});
          });
        });
        spec.example('size should accept format shorthand with parens', 255, function () {
          return new Attribute({name: 'comments', type: 'String(255)'}).size;
        });
      });
      spec.heading('Number', function () {
        spec.example("type should be 'Number'", 'Number', function () {
          return new Attribute({name: 'healthPoints', type: 'Number'}).type;
        });
      });
      spec.heading('Date', function () {
        spec.example("type should be 'Date'", 'Date', function () {
          return new Attribute({name: 'born', type: 'Date'}).type;
        });
      });
      spec.heading('Boolean', function () {
        spec.example("type should be 'Boolean'", 'Boolean', function () {
          return new Attribute({name: 'bored', type: 'Boolean'}).type;
        });
      });
      spec.heading('Model', function () {
        spec.paragraph('Parameter type Model is used to store a reference to another model instance.  ' +
        'The value attribute is a Attribute.ModelID reference to the Model.');

        spec.example('must construct with Attribute.ModelID in value', Error('error creating Attribute: value must be Attribute.ModelID'), function () {
          new Attribute({name: 'Twiggy', type: 'Model'});
        });
        spec.example("modelType property set from constructor", 'Model', function () {
          return new Attribute(
            {name: 'Twiggy',
              type: 'Model',
              value: new Attribute.ModelID(new Model())
            }).modelType;
        });
      });
      spec.heading('Group', function () {
        spec.paragraph('Groups are used to keep attributes together for presentation purposes.');
        spec.example("should have type of 'Group'", 'Group', function () {
          return new Attribute({name: 'stuff', type: 'Group'}).type;
        });
        spec.example('deep check value for valid Attributes that pass getObjectStateErrors() test', 1, function () {
          // this example is just to conceptualize nested components
          var myStuff = new Attribute("stuff", "Group");
          var myCars = new Attribute("cars", "Group");
          var myFood = new Attribute("food", "Group");
          var myFruit = new Attribute("fruit", "Group");
          var myVegs = new Attribute("vegetables", "Group");
          var badApple = new Attribute('Apple');
          myCars.value = [new Attribute('Nova'), new Attribute('Pinto')];
          myFruit.value = [badApple, new Attribute('Peach')];
          myVegs.value = [new Attribute('Carrot'), new Attribute('Beet')];
          myFood.value = [myFruit, myVegs];
          myStuff.value = [myFood, myCars, new Attribute('House'), new Attribute('Health')];
          spec.show(myStuff.getObjectStateErrors());
          badApple.value = -1; // One bad apple will spoil my stuff
          spec.show(myStuff.getObjectStateErrors());
          return myStuff.getObjectStateErrors().length;
        });
      });
      spec.heading('Table', function () {
        spec.paragraph("Table types are used to store an array of values (rows) each of which is an array of " +
          "values (columns).  Each column value is associated with the corresponding element in the Table " +
          "property group which is set when creating a Table."
        );
        spec.example("should have type of 'Table'", 'Table', function () {
          var name = new Attribute("Name");
          var cols = new Attribute({name: 'columns', type: 'Group', value: [name]});
          return new Attribute({name: 'bills', type: 'Table', group: cols }).type;
        });
        spec.example("group property must be defined", Error('error creating Attribute: group property required'),
          function () {
            new Attribute({name: 'details', type: 'Table'});
          });
        spec.example("group property must not be empty array",
          Error('error creating Attribute: group property value must contain at least one Attribute'), function () {
            var cols = new Attribute({name: 'columns', type: 'Group', value: []});
            new Attribute({name: 'details', type: 'Table', group: cols });
          });
      });
      spec.heading('Object', function () {
        spec.paragraph('Javascript objects ... structure user defined');
        spec.example("should have type of 'Object'", 'Object', function () {
          return new Attribute({name: 'stuff', type: 'Object'}).type;
        });
      });
    });
    spec.heading('METHODS', function () {
      spec.heading('toString()', function () {
        spec.example('should return a description of the attribute', 'Attribute: name', function () {
          return new Attribute({name: 'name'}).toString();
        });
      });
      spec.heading('coerce(newValue)', function () {
        spec.paragraph('Method returns the type equivalent of newValue for the owner objects type.');
        spec.example('coerce method basic usage', undefined, function () {
          var myString = new Attribute({name: 'name', size: 10});
          var myNumber = new Attribute({name: 'age', type: 'Number' });
          var myBool = new Attribute({name: 'active', type: 'Boolean' });
          var myDate = new Attribute({name: 'date', type: 'Date' });
          var myGroup = new Attribute({name: 'columns', type: 'Group', value: [new Attribute("Name")]});
          var myTable = new Attribute({name: 'bills', type: 'Table', group: myGroup });

          // Strings
          spec.assertion(myString.coerce() === '');
          spec.assertion(myString.coerce(false) === 'false');
          spec.assertion(myString.coerce(12) === '12');
          spec.assertion(myString.coerce(1 / 0) === 'Infinity');
          spec.assertion(myString.coerce('01234567890') === '0123456789');
          spec.assertion(myString.coerce() === '');
          // Numbers
          spec.assertion(myNumber.coerce() === 0);
          spec.assertion(myNumber.coerce(false) === 0);
          spec.assertion(myNumber.coerce(true) === 1);
          spec.assertion(myNumber.coerce(' 007 ') === 7);
          spec.assertion(myNumber.coerce(' $123,456.78 ') === 123456.78);
          spec.assertion(myNumber.coerce(' $123, 456.78 ') === 123); // space will split
          spec.assertion(myNumber.coerce('4/20') === 0); // slash kills it
          // Boolean
          spec.assertion(myBool.coerce() === false && myBool.coerce(null) === false && myBool.coerce(0) === false);
          spec.assertion(myBool.coerce(true) === true && myBool.coerce(1) === true);
          spec.assertion(myBool.coerce('y') && myBool.coerce('yEs') && myBool.coerce('t') && myBool.coerce('TRUE') && myBool.coerce('1'));
          spec.assertion(!((myBool.coerce('') || (myBool.coerce('yep')))));
          // Date
          spec.assertion(myDate.coerce('2/21/2014').getTime() === new Date('2/21/2014').getTime());
          spec.assertion(myDate.coerce('2/21').getTime() === new Date('2/21/2014').getTime());

          // TODO
          spec.shouldThrow(Error('coerce cannot determine appropriate value'), function () {
            new Attribute({name: 'Twiggy', type: 'Model', value: new Attribute.ModelID(new Model())}).coerce();
          });
          spec.shouldThrow(Error('coerce cannot determine appropriate value'), function () {
            new Attribute(myGroup.coerce());
          });
          spec.shouldThrow(Error('coerce cannot determine appropriate value'), function () {
            new Attribute(myTable.coerce());
          });
        });
      });
      spec.heading('getObjectStateErrors', function () {
        spec.example('should return array of validation errors', undefined, function () {
          spec.assertion(new Attribute({name: 'name'}).getObjectStateErrors() instanceof Array);
          var nameHosed = new Attribute({name: 'name'}); // No errors
          spec.assertion(nameHosed.getObjectStateErrors().length == 0);
          nameHosed.name = ''; // 1 err
          spec.assertion(nameHosed.getObjectStateErrors().length == 1);
          nameHosed.type = ''; // 2 errors
          spec.assertion(nameHosed.getObjectStateErrors().length == 2);
        });
      });
      spec.heading('onEvent', function () {
        spec.paragraph('Use onEvent(events,callback)');
        spec.example('first parameter is a string or array of event subscriptions', Error('subscription string or array required'), function () {
          new Attribute({name: 'name'}).onEvent();
        });
        spec.example('callback is required', Error('callback is required'), function () {
          new Attribute({name: 'name'}).onEvent([]);
        });
        spec.example('events are checked against known types', Error('Unknown command event: onDrunk'), function () {
          new Attribute({name: 'name'}).onEvent(['onDrunk'], function () {
          });
        });
        spec.example('here is a working version', undefined, function () {
          spec.show(T.getAttributeEvents());
          // Validate - callback when attribute needs to be validated
          // StateChange -- callback when state of object (value or validation state) has changed
          new Attribute({name: 'name'}).onEvent(['Validate'], function () {
          });
        });
      });
      spec.heading('validate', function () {
        spec.paragraph('check valid object state and value for attribute - invoke callback for results');
        spec.example('callback is required', Error('callback is required'), function () {
          new Attribute({name: 'name'}).validate();
        });
      });
      spec.heading('setError', function () {
        spec.paragraph('Set a error condition and descriptive message');
        spec.example('first argument condition required', Error('condition required'), function () {
          new Attribute({name: 'status'}).setError();
        });
        spec.example('second argument description required', Error('description required'), function () {
          new Attribute({name: 'status'}).setError('login');
        });
      });
      spec.heading('clearError', function () {
        spec.paragraph('Clear a error condition');
        spec.example('first argument condition required', Error('condition required'), function () {
          new Attribute({name: 'status'}).clearError();
        });
      });
    });
    spec.heading('INTEGRATION', function () {
      spec.example('validation usage demonstrated', spec.asyncResponse('got milk'), function (testNode, returnResponse) {
        var attribute = new Attribute({name: 'test'});

        // Monitor state changes
        attribute.onEvent('StateChange', function () {
          // When the error is got milk then test is done
          if (attribute.validationMessage == 'got milk')
            returnResponse(testNode, 'got milk');
        });

        // validate will first make sure the object passes integrity checks
        attribute.name = '';
        attribute.validate(test1);

        // verify error seen
        function test1() {
          spec.assertion(attribute.validationMessage == 'name required');
          // Create a validation rule - value must be equal to 42
          attribute.onEvent('Validate', function () {
            if (attribute.value !== 42)
              attribute.validationErrors.push('Incorrect answer');
          });
          attribute.validate(test2);
        }

        // same error in message
        function test2() {
          spec.assertion(attribute.validationMessage == 'name required');
          attribute.name = 'answer';
          attribute.validate(test3);
        }

        // Now validation function error is shown
        function test3() {
          spec.assertion(attribute.validationMessage == 'Incorrect answer');
          // Fix everything
          attribute.value = 42;
          attribute.validate(test4);
        }

        // Type is wrong
        function test4() {
          spec.assertion(attribute.validationMessage == 'value must be null or a String');
          // Fix type
          attribute.type = 'Number';
          attribute.validate(test5);
        }

        // Should have no errors
        function test5() {
          spec.assertion(attribute.validationMessage == '');
          attribute.setError('uno', 'uno failed');
          attribute.setError('milk', 'and cookies');
          attribute.setError('milk', 'got milk'); // test overwrite of same condition diff msg
          attribute.validate(test6);
        }

        // now error is first set error
        function test6() {
          spec.assertion(attribute.validationMessage == 'uno failed');
          attribute.clearError('zzz'); // delete a prop that does not exists is silent
          attribute.clearError('uno');
          attribute.validate(function () {
            //
          });
        }
      });
    });
*/
  });

});
