/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/misc/test-header
 **/
(function () {
"use strict";
var root = this;
var testSpec = function(spec,CORE) {
/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core.test.js
 **/
spec.test('tgi-core/lib/tgi-core.test.js', 'Core Library', function (callback) {
  callback({log: 'tgi-core/lib/tgi-core.test.js'});
  spec.heading('TGI CORE', function () {
    spec.paragraph('Core Objects.');
    spec.example('CORE function exposes library', 'function', function () {
      return typeof CORE;
    });
    spec.example('UTILITY functions are available in closure', 'function', function () {
      return typeof inheritPrototype;
    });
  });
});

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-attribute.spec.js
 */
spec.test('tgi-core/lib/tgi-core-attribute.spec.js', 'Attribute', function (callback) {
  callback({log: 'tgi-core/lib/tgi-core-attribute.spec.js'});

  spec.heading('Attribute Class', function () {
    spec.paragraph('Attributes are the means for models to represent data of different types.  They have no' +
    ' dependencies on Models however and can be used without creating a model.');
    spec.heading('CONSTRUCTOR', function () {
      spec.example('objects created should be an instance of Attribute', true, function () {
        return new Attribute({name: 'name'}) instanceof Attribute;
      });
      spec.example('should make sure new operator used', Error('new operator required'), function () {
        /* jshint ignore:start */
        Attribute({name: 'name'});
        /* jshint ignore:end */
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
    });
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
          //spec.show(T.getAttributeTypes());
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
          this.shouldBeTrue(new Attribute({name: 'name'}).validationErrors instanceof Array);
          this.shouldBeTrue(new Attribute({name: 'name'}).validationErrors.length === 0);
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
          spec.example('validationRule.required', spec.asyncResults('Name required'), function (callback) {
            var a = new Attribute({name: 'name', validationRule: {required: true}});
            a.validate(function () {
              callback(a.validationErrors);
            });
          });
          spec.example('validationRule.required for Number allows 0', spec.asyncResults(0), function (callback) {
            var a = new Attribute({name: 'balance', type: 'Number', value: 0, validationRule: {required: true}});
            a.validate(function () {
              callback( a.validationErrors.length);
            });
          });
          spec.example('validationRule.required for Boolean allows false', spec.asyncResults(0), function (callback) {
            var a = new Attribute({name: 'active', type: 'Boolean', value: false, validationRule: {required: true}});
            a.validate(function () {
              callback( a.validationErrors.length);
            });
          });
        });
        spec.heading('validationRule.range', function () {
          spec.paragraph('validationRule.range is used when value must fall within a range of values- use null to omit bound');
          spec.example('validationRule.range lower bound only', spec.asyncResults('Age must be at least 18'), function (callback) {
            var a = new Attribute({name: 'age', type: 'Number', value: 17, validationRule: {range: [18, null]}});
            a.validate(function () {
              callback( a.validationErrors[0]);
            });
          });
          spec.example('validationRule.range upper bound only', spec.asyncResults('Age must be no more than 65'), function (callback) {
            var a = new Attribute({name: 'age', type: 'Number', value: 77, validationRule: {range: [null, 65]}});
            a.validate(function () {
              callback( a.validationErrors[0]);
            });
          });
          spec.example('validationRule.range pass', spec.asyncResults(0), function (callback) {
            var a = new Attribute({name: 'age', type: 'Number', value: 53, validationRule: {range: [18, 65]}});
            a.validate(function () {
              callback( a.validationErrors.length);
            });
          });
          spec.example('validationRule.range forced to array', spec.asyncResults('Age must be at least 100'), function (callback) {
            var a = new Attribute({name: 'age', type: 'Number', value: 53, validationRule: {range: 100}});
            a.validate(function () {
              callback( a.validationErrors);
            });
          });
        });
        spec.heading('validationRule.isOneOf', function () {
          spec.paragraph('validationRule.isOneOf is used when a value is must be on of items in array');

          spec.example('validationRule.isOneOf fail', spec.asyncResults('Age invalid'), function (callback) {
            var a = new Attribute({name: 'age', type: 'Number', value: 2, validationRule: {isOneOf: [1, 3]}});
            a.validate(function () {
              callback( a.validationErrors[0]);
            });
          });
          spec.example('validationRule.isOneOf pass', spec.asyncResults(0), function (callback) {
            var a = new Attribute({name: 'age', type: 'Number', value: 1, validationRule: {isOneOf: [1, 3]}});
            a.validate(function () {
              callback( a.validationErrors.length);
            });
          });
        });

      });
      spec.heading('value', function () {
        spec.example('should accept null assignment', undefined, function () {
          var myTypes = Attribute.getAttributeTypes();
          var record = '';
          for (var i = 0; i < myTypes.length; i++) {
            record += myTypes[i] + ':' + new Attribute({name: 'my' + myTypes[i]}).value + ' ';
          }
          //spec.show(record);
          // It's the default and it passes constructor validation
        });
        spec.example('should accept assignment of correct type and validate incorrect attributeTypes',
          '7 correct assignments 91 errors thrown', function () {
            // Test all known attribute types
            var myTypes = Attribute.getAttributeTypes();
            myTypes.shift(); // not testing ID
            myTypes.pop(); // not testing Object since it matches other types
            //spec.show(myTypes);
            //spec.show(T.getAttributeTypes());

            // Now create an array of matching values for each type into myValues
            var myModel = new Model();
            var myGroup = new Attribute({name: 'columns', type: 'Group', value: [new Attribute("Name")]});
            var myTable = new Attribute({name: 'bills', type: 'Table', group: myGroup});
            var myValues = ['Jane Doe', new Date(), true, 18, new Attribute.ModelID(new Model()), [], myTable];

            // Loop thru each type
            var theGood = 0;
            var theBad = 0;
            for (var i = 0; i < myTypes.length; i++)
              for (var j = 0; j < myValues.length; j++) {
                // for the value that works it won't throw error just create and to test
                if (i === j) {
                  theGood++;
                  switch (myTypes[i]) {
                    case 'Table':
                      new Attribute({name: 'my' + myTypes[i], type: myTypes[i], value: myValues[j], group: myGroup});
                      break;
                    default:
                      new Attribute({name: 'my' + myTypes[i], type: myTypes[i], value: myValues[j]});
                      break;
                  }
                } else {
                  // mismatches bad so should throw error (is caught unless no error or different error)
                  theBad++;
                  /* jshint ignore:start */
                  this.shouldThrowError('*', function () {
                    new Attribute({name: 'my' + myTypes[i], type: myTypes[i], value: myValues[j]});
                  });
                  /* jshint ignore:end */
                }
                // other objects should throw always
                theBad++;
                /* jshint ignore:start */
                this.shouldThrowError('*', function () {
                  new Attribute({name: 'my' + myTypes[i], type: myTypes[i], value: {}});
                });
                /* jshint ignore:end */
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
        spec.example('size should be an integer', Error('error creating Attribute: size must be a number from 1 to 255'), function () {
          new Attribute({name: 'zipCode', size: "10"});
        });
        spec.example('size should be between 1 and 255', undefined, function () {
          this.shouldThrowError(Error('error creating Attribute: size must be a number from 1 to 255'), function () {
            new Attribute({name: 'partyLikeIts', size: 1999});
          });
          this.shouldThrowError(Error('error creating Attribute: size must be a number from 1 to 255'), function () {
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
            {
              name: 'Twiggy',
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
          //spec.show(myStuff.getObjectStateErrors());
          badApple.value = -1; // One bad apple will spoil my stuff
          //spec.show(myStuff.getObjectStateErrors());
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
          return new Attribute({name: 'bills', type: 'Table', group: cols}).type;
        });
        spec.example("group property must be defined", Error('error creating Attribute: group property required'),
          function () {
            new Attribute({name: 'details', type: 'Table'});
          });
        spec.example("group property must not be empty array",
          Error('error creating Attribute: group property value must contain at least one Attribute'), function () {
            var cols = new Attribute({name: 'columns', type: 'Group', value: []});
            new Attribute({name: 'details', type: 'Table', group: cols});
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
          var myNumber = new Attribute({name: 'age', type: 'Number'});
          var myBool = new Attribute({name: 'active', type: 'Boolean'});
          var myDate = new Attribute({name: 'date', type: 'Date'});
          var myGroup = new Attribute({name: 'columns', type: 'Group', value: [new Attribute("Name")]});
          var myTable = new Attribute({name: 'bills', type: 'Table', group: myGroup});

          // Strings
          this.shouldBeTrue(myString.coerce() === '');
          this.shouldBeTrue(myString.coerce(false) === 'false');
          this.shouldBeTrue(myString.coerce(12) === '12');
          this.shouldBeTrue(myString.coerce(1 / 0) === 'Infinity');
          this.shouldBeTrue(myString.coerce('01234567890') === '0123456789');
          this.shouldBeTrue(myString.coerce() === '');
          // Numbers
          this.shouldBeTrue(myNumber.coerce() === 0);
          this.shouldBeTrue(myNumber.coerce(false) === 0);
          this.shouldBeTrue(myNumber.coerce(true) === 1);
          this.shouldBeTrue(myNumber.coerce(' 007 ') === 7);
          this.shouldBeTrue(myNumber.coerce(' $123,456.78 ') === 123456.78);
          this.shouldBeTrue(myNumber.coerce(' $123, 456.78 ') === 123); // space will split
          this.shouldBeTrue(myNumber.coerce('4/20') === 0); // slash kills it
          // Boolean
          this.shouldBeTrue(myBool.coerce() === false && myBool.coerce(null) === false && myBool.coerce(0) === false);
          this.shouldBeTrue(myBool.coerce(true) === true && myBool.coerce(1) === true);
          this.shouldBeTrue(myBool.coerce('y') && myBool.coerce('yEs') && myBool.coerce('t') && myBool.coerce('TRUE') && myBool.coerce('1'));
          this.shouldBeTrue(!((myBool.coerce('') || (myBool.coerce('yep')))));
          // Date
          this.shouldBeTrue(myDate.coerce('2/21/2014').getTime() === new Date('2/21/2014').getTime());
          this.shouldBeTrue(myDate.coerce('2/21').getTime() === new Date('2/21/2014').getTime());

          // TODO
          this.shouldThrowError(Error('coerce cannot determine appropriate value'), function () {
            new Attribute({name: 'Twiggy', type: 'Model', value: new Attribute.ModelID(new Model())}).coerce();
          });
          this.shouldThrowError(Error('coerce cannot determine appropriate value'), function () {
            new Attribute(myGroup.coerce());
          });
          this.shouldThrowError(Error('coerce cannot determine appropriate value'), function () {
            new Attribute(myTable.coerce());
          });
        });
      });
      spec.heading('getObjectStateErrors', function () {
        spec.example('should return array of validation errors', undefined, function () {
          this.shouldBeTrue(new Attribute({name: 'name'}).getObjectStateErrors() instanceof Array);
          var nameHosed = new Attribute({name: 'name'}); // No errors
          this.shouldBeTrue(nameHosed.getObjectStateErrors().length === 0);
          nameHosed.name = ''; // 1 err
          this.shouldBeTrue(nameHosed.getObjectStateErrors().length === 1);
          nameHosed.type = ''; // 2 errors
          this.shouldBeTrue(nameHosed.getObjectStateErrors().length === 2);
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
          //spec.show(T.getAttributeEvents());
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
      spec.example('validation usage demonstrated', spec.asyncResults('got milk'), function (callback) {
        var thisCrap = this;
        var attribute = new Attribute({name: 'test'});

        // Monitor state changes
        attribute.onEvent('StateChange', function () {
          // When the error is got milk then test is done
          if (attribute.validationMessage === 'got milk')
            callback( 'got milk');
        });

        // validate will first make sure the object passes integrity checks
        attribute.name = '';
        attribute.validate(test1);

        // verify error seen
        function test1() {
          thisCrap.shouldBeTrue(attribute.validationMessage == 'name required');
          // Create a validation rule - value must be equal to 42
          attribute.onEvent('Validate', function () {
            if (attribute.value !== 42)
              attribute.validationErrors.push('Incorrect answer');
          });
          attribute.validate(test2);
        }

        // same error in message
        function test2() {
          thisCrap.shouldBeTrue(attribute.validationMessage == 'name required');
          attribute.name = 'answer';
          attribute.validate(test3);
        }

        // Now validation function error is shown
        function test3() {
          thisCrap.shouldBeTrue(attribute.validationMessage == 'Incorrect answer');
          // Fix everything
          attribute.value = 42;
          attribute.validate(test4);
        }

        // Type is wrong
        function test4() {
          thisCrap.shouldBeTrue(attribute.validationMessage == 'value must be null or a String');
          // Fix type
          attribute.type = 'Number';
          attribute.validate(test5);
        }

        // Should have no errors
        function test5() {
          thisCrap.shouldBeTrue(attribute.validationMessage === '');
          attribute.setError('uno', 'uno failed');
          attribute.setError('milk', 'and cookies');
          attribute.setError('milk', 'got milk'); // test overwrite of same condition diff msg
          attribute.validate(test6);
        }

        // now error is first set error
        function test6() {
          thisCrap.shouldBeTrue(attribute.validationMessage == 'uno failed');
          attribute.clearError('zzz'); // delete a prop that does not exists is silent
          attribute.clearError('uno');
          attribute.validate(function () {
            //
          });
        }
      });
    });
  });
});

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-command.spec.js
 */
spec.test('tgi-core/lib/tgi-core-command.test.js', 'Command', function (callback) {

  spec.heading('Command Class', function () {
    spec.paragraph('The command design pattern is implemented with this class.  The actual execution of the command ' +
    'can be one of multiple types from simple code to a _Presentation Model_ applied to a _Interface_ implementation.');
    spec.heading('CONSTRUCTOR', function () {
      spec.example('objects created should be an instance of Command', true, function () {
        return new Command({name: 'about'}) instanceof Command;
      });
      spec.example('should make sure new operator used', Error('new operator required'), function () {
        Command({name: 'about'}); // jshint ignore:line
      });
      spec.example('should make sure argument properties are valid', Error('error creating Command: invalid property: sex'), function () {
        new Command({name: 'name', sex: 'female'});
      });
      spec.example('defaults name to (unnamed)', '(unnamed)', function () {
        return new Command().name;
      });
      spec.example('defaults type to Stub', 'Stub', function () {
        return new Command({name: 'about'}).type;
      });
    });
    spec.heading('PROPERTIES', function () {
      spec.heading('name', function () {
        spec.example('identifier name for command', 'about', function () {
          this.shouldThrowError(Error('name must be string'), function () {
            new Command({name: 42});
          });
          return new Command({name: 'about'}).name;
        });
      });
      spec.heading('description', function () {
        spec.example('more descriptive than name (for menus)', 'Tequila Command : Tequila is a beverage made from blue agave.', function () {
          // description set to (name) Command if not specified
          return new Command({name: 'Tequila'}).description + ' : ' +
            new Command({name: 'tequila', description: 'Tequila is a beverage made from blue agave.'}).description;
        });
      });
      spec.heading('type', function () {
        spec.example('type of command must be valid', Error('Invalid command type: magic'), function () {
          //spec.show(T.getCommandTypes());
          new Command({name: 'about', type: 'magic' });
        });
      });
      spec.heading('contents', function () {
        spec.paragraph('Contents is based on the type of command.  See TYPE section for more information for how it ' +
        'applies to each type');
      });
      spec.heading('scope', function () {
        spec.paragraph('Optional scope property can be used to apply a model or list to a command.');
        spec.example('scope must be a Model or a List', Error('optional scope property must be Model or List'), function () {
          new Command({name: 'archiveData', scope: true});
        });
      });
      spec.heading('status', function () {
        spec.paragraph('The status property is a Number defined as negative(FAIL) positive(SUCCESS) zero(executing) ' +
        'null/undefined(not executing).');
        spec.paragraph('Applications can give meaning to numeric values (lt -1 and gt 1) as long as sign is retained.');
      });
      spec.heading('timeout', function () {
        spec.paragraph('Will use library setting as default, override to set the default timeout for steps used in ' +
        'procedures. Value is milliseconds (1000 = 1 second)');
        spec.example('number required', Error('timeout must be a Number'), function () {
          new Command({name: 'options', timeout: true});
        });
      });
      spec.heading('theme', function () {
        spec.example('theme attribute provides visual cue', undefined, function () {
          // The good
          new Command({name: 'options', theme: 'default'});
          new Command({name: 'options', theme: 'primary'});
          new Command({name: 'options', theme: 'success'});
          new Command({name: 'options', theme: 'info'});
          new Command({name: 'options', theme: 'warning'});
          new Command({name: 'options', theme: 'danger'});
          new Command({name: 'options', theme: 'link'});
          // The bad
          this.shouldThrowError(Error('invalid theme'), function () {
            new Command({name: 'options', theme: 'Silly'});
          });
          // The ugly
          this.shouldThrowError(Error('invalid theme'), function () {
            new Command({name: 'options', theme: true});
          });
        });

      });
      spec.heading('icon', function () {
        spec.paragraph('The icon attribute gives a graphical association to the command.' +
        ' They are interface specific and do break the abstractness of this library but can be ignored by' +
        ' other interfaces safely.');
        spec.example('must be string and have prefix for 2 supported icon sets ' +
        'http://glyphicons.com/ http://fontawesome.io/', undefined, function () {

          this.shouldThrowError(Error('invalid icon'), function () {
            new Command({name: 'options', icon: true});
          });
          this.shouldThrowError(Error('invalid icon'), function () {
            new Command({name: 'options', icon: 'wtf-lol'});
          });
          // Only prefix is validated
          new Command({name: 'options', icon: 'fa-whatever'});
          new Command({name: 'options', icon: 'glyphicon-who-cares'});
          // Must have something to the right of the dash
          this.shouldThrowError(Error('invalid icon'), function () {
            new Command({name: 'options', icon: 'fa'});
          });
        });
      });

      spec.heading('bucket', function () {
        spec.example('valid property is for app use', 'bucket of KFC', function () {
          return 'bucket of ' + new Command({bucket: 'KFC'}).bucket;
        });
      });
    });
    spec.heading('TYPES', function () {
      spec.heading('menu', function () {
        spec.paragraph('The menu command is passed to _Interface_ for use for in user navigation.  ' +
        'They are embedded in the _Application_ as the primary navigate but can be instantiated and given to ' +
        '_Interface_ in any context.');
        spec.paragraph('The _Command_ contents property is an array _Command_ objects.');
        spec.example('constructor validates the contents', undefined, function () {
          this.shouldThrowError(Error('contents must be array of menu items'), function () {
            new Command({name: 'options', type: 'Menu'});
          });
          this.shouldThrowError(Error('contents must be array of menu items'), function () {
            new Command({name: 'options', type: 'Menu', contents: []});
          });
          this.shouldThrowError(Error('contents must be array of menu items'), function () {
            new Command({name: 'options', type: 'Menu', contents: [42]});
          });
          // This is a working example:
          new Command({name: 'options', type: 'Menu', contents: [
            'Stooges',                      // strings act as menu titles or non selectable choices
            '-',                            // dash is menu separator
            new Command({name: 'Tequila'})  // use commands for actual menu items
          ]});
        });
      });
      spec.heading('Presentation', function () {
        spec.example('for Presentation type contents is a Presentation object', undefined, function () {
          this.shouldThrowError(Error('contents must be a Presentation'), function () {
            new Command({name: 'options', type: 'Presentation'});
          });
        });
      });
      spec.heading('Function', function () {
        spec.paragraph('contents contains a javascript function');
        spec.example('for Function type contents is a Function', undefined, function () {
          this.shouldThrowError(Error('contents must be a Function'), function () {
            new Command({name: 'options', type: 'Function'});
          });
        });
      });
      spec.heading('Procedure', function () {
        spec.example('for Procedure type contents is a Procedure object', undefined, function () {
          this.shouldThrowError(Error('contents must be a Procedure'), function () {
            new Command({name: 'options', type: 'Procedure'});
          });
        });
      });
    });
    spec.heading('METHODS', function () {
      spec.heading('toString', function () {
        spec.example('returns string including name and type', 'I am a Stub Command: Customer', function () {
          return 'I am a ' + new Command({name: 'Customer'});
        });
      });
      spec.heading('abort', function () {
        spec.paragraph('aborts task');
        spec.example('aborted command ends with error status', -1, function () {
          var cmd = new Command();
          cmd.abort();
          return cmd.status;
        });
      });
      spec.heading('complete', function () {
        spec.paragraph('completes task');
        spec.example('call when task complete status', 1, function () {
          var cmd = new Command();
          cmd.complete();
          return cmd.status;
        });
      });
      spec.heading('execute', function () {
        spec.paragraph('executes task');
        spec.example('see integration tests', Error('command type Stub not implemented'), function () {
          new Command().execute();
        });
      });
      spec.heading('onEvent', function () {
        spec.paragraph('Use onEvent(events,callback)');
        spec.example('first parameter is a string or array of event subscriptions', Error('subscription string or array required'), function () {
          new Command().onEvent();
        });
        spec.example('callback is required', Error('callback is required'), function () {
          new Command().onEvent([]);
        });
        spec.example('events are checked against known types', Error('Unknown command event: onDrunk'), function () {
          new Command().onEvent(['onDrunk'], function () {
          });
        });
        spec.example('here is a working version', undefined, function () {
          //spec.show(T.getCommandEvents());
          //  BeforeExecute - callback called before first task executed but after tasks initialized
          //  AfterExecute - callback called after initial task(s) launched (see onCompletion)
          //  Error - error occurred (return {errorClear:true})
          //  Aborted - procedure aborted - should clean up resources
          //  Completed - execution is complete check status property
          new Command().onEvent(['Completed'], function () {
          });
        });
      });

    });
    // spec.runnerCommandIntegration();
  });
  

});

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-delta.test.js
 */
spec.test('tgi-core/lib/tgi-core-delta.test.js', 'Delta', function (callback) {
});

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-interface.test.js
 */
spec.test('tgi-core/lib/tgi-core-interface.test.js', 'Interface', function (callback) {
});

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-list.test.js
 */
spec.test('tgi-core/lib/tgi-core-list.test.js', 'List', function (callback) {
});

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-message.test.js
 */
spec.test('tgi-core/lib/tgi-core-message.test.js', 'Message', function (callback) {
});

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-model.spec.js
 */
spec.test('tgi-core/lib/tgi-core-model.spec.js', 'Model', function (callback) {
  callback({log: 'tgi-core/lib/tgi-core-model.spec.js'});

  var SurrogateModelClass = Model;

  spec.heading('Model Class', function () {
    spec.paragraph('Models being the primary purpose of this library are extensions of javascript objects.  ' +
    'The tequila class library provides this class to encapsulate and enforce consistent programming interface' +
    'to the models created by this library.');
    spec.heading('CONSTRUCTOR', function () {
      spec.paragraph('Creation of all Models must adhere to following examples:');
      spec.example('objects created should be an instance of Model', true, function () {
        return new SurrogateModelClass() instanceof Model;
      });
      spec.example('should make sure new operator used', Error('new operator required'), function () {
        SurrogateModelClass(); // jshint ignore:line
      });
      spec.example('should make sure properties are valid', Error('error creating Model: invalid property: sup'), function () {
        new SurrogateModelClass({sup: 'yo'});
      });
      spec.example('can supply attributes in constructor in addition to ID default', 'scrabble', function () {
        var play = new SurrogateModelClass({attributes: [new Attribute('game')]});
        play.set('game', 'scrabble'); // this would throw error if attribute did not exist
        return play.get('game');
      });
    });
    spec.heading('PROPERTIES', function () {
      spec.heading('tags', function () {
        spec.paragraph('Tags are an array of strings that can be used in searching.');
        spec.example('should be an array or undefined', undefined, function () {
          var m = new SurrogateModelClass(); // default is undefined
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
          var goodModel = new SurrogateModelClass(), badModel = new SurrogateModelClass();
          badModel.attributes = 'wtf';
          return (goodModel.getObjectStateErrors().length === 0 && badModel.getObjectStateErrors().length == 1);
        });
        spec.example('elements of array must be instance of Attribute', undefined, function () {
          // passing true to getObjectStateErrors() means only check model and not subclass validations
          // todo make unit test for above
          var model = new SurrogateModelClass();
          model.attributes = [new Attribute("ID", "ID")];
          this.shouldBeTrue(model.getObjectStateErrors(true).length === 0);
          model.attributes = [new Attribute("ID", "ID"), new SurrogateModelClass(), 0, 'a', {}, [], null];
          this.shouldBeTrue(model.getObjectStateErrors(true).length == 6);
        });
      });
      spec.heading('value', function () {
      });
    });
    spec.heading('METHODS', function () {
      spec.heading('toString()', function () {
        spec.example('should return a description of the model', true, function () {
          return new SurrogateModelClass().toString().length > 0;
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
          this.shouldBeTrue(new SurrogateModelClass().getObjectStateErrors() instanceof Array);
        });
        spec.example('first attribute must be an ID field', 'first attribute must be ID', function () {
          var m = new SurrogateModelClass();
          m.attributes = [new Attribute('spoon')];
          return m.getObjectStateErrors();
        });
      });
      spec.heading('onEvent', function () {
        spec.paragraph('Use onEvent(events,callback)');
        spec.example('first parameter is a string or array of event subscriptions', Error('subscription string or array required'), function () {
          new SurrogateModelClass().onEvent();
        });
        spec.example('callback is required', Error('callback is required'), function () {
          new SurrogateModelClass().onEvent([]);
        });
        spec.example('events are checked against known types', Error('Unknown command event: onDrunk'), function () {
          new SurrogateModelClass().onEvent(['onDrunk'], function () {
          });
        });
        spec.example('here is a working version', undefined, function () {
          //spec.show(T.getAttributeEvents());
          // Validate - callback when attribute needs to be validated
          // StateChange -- callback when state of object (value or validation state) has changed
          new Model().onEvent(['Validate'], function () {
          });
        });
      });
      spec.heading('get(attributeName)', function () {
        spec.example('returns undefined if the attribute does not exist', undefined, function () {
          this.shouldBeTrue(new SurrogateModelClass().get('whatever') === undefined);
        });
        spec.example("returns the value for given attribute", 42, function () {
          var question = new SurrogateModelClass({attributes: [new Attribute('answer', 'Number')]});
          question.attributes[1].value = 42;
          return question.get('answer');
        });
      });
      spec.heading('getAttributeType(attributeName)', function () {
        spec.example('returns attribute type for given attribute name', 'Date', function () {
          return new Model({attributes: [new Attribute('born', 'Date')]}).getAttributeType('born');
        });
      });
      spec.heading('set(attributeName,value)', function () {
        spec.example('throws an error if the attribute does not exists', Error('attribute not valid for model'), function () {
          new SurrogateModelClass().set('whatever');
        });
        spec.example("sets the value for given attribute", 42, function () {
          var question = new SurrogateModelClass({attributes: [new Attribute('answer', 'Number')]});
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
        var model = new Model({attributes: [
          new Attribute({name: 'Name', validationRule: {required: true}}),
          new Attribute({name: 'Age', type: 'Number', validationRule: {range: [18, null]}}),
          new Attribute({name: 'Sex', validationRule: {required: true}})
        ]});

        model.setError('danger','Danger Will Robinson');

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
            callback( 'test2: ' + model.validationErrors.length);
          }
        }

        // Expect 1 errors since all attributes fixed but model will fail
        function test3() {
          if (model.validationErrors.length == 1 && model.validationMessage == 'Males must be 21 or over') {
            model.set('age', 21);
            model.validate(test4);
          } else {
            callback( 'test3: ' + model.validationErrors.length);
          }
        }

        // Test done should be no errors (to pass final test)
        function test4() {
          callback( 'test4: ' + model.validationErrors.length);
        }
      });
    });
  });
 
  
  
  
});

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-procedure.test.js
 */
spec.test('tgi-core/lib/tgi-core-procedure.test.js', 'Procedure', function (callback) {
});

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-request.test.js
 */
spec.test('tgi-core/lib/tgi-core-request.test.js', 'Request', function (callback) {
});

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-store.test.js
 */
spec.test('tgi-core/lib/tgi-core-store.test.js', 'Store', function (callback) {
});

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-transport.test.js
 */
spec.test('tgi-core/lib/tgi-core-transport.test.js', 'Transport', function (callback) {
});

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/misc/test-footer
 **/
};
  /* istanbul ignore next */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = testSpec;
    }
    exports.testSpec = testSpec;
  } else {
    root.testSpec = testSpec;
  }
}).call(this);