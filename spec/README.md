#### TGI CORE
<p>Core Objects.</p>
&nbsp;<b><i>CORE function exposes library:</i></b>
```javascript
return typeof CORE;
```
<blockquote>returns <strong>function</strong> as expected
</blockquote>
&nbsp;<b><i>UTILITY functions are available in closure:</i></b>
```javascript
return typeof inheritPrototype;
```
<blockquote>returns <strong>function</strong> as expected
</blockquote>
#### Attribute Class
<p>Attributes are the means for models to represent data of different types.  They have no dependencies on Models however and can be used without creating a model.</p>
#### CONSTRUCTOR
&nbsp;<b><i>objects created should be an instance of Attribute:</i></b>
```javascript
return new Attribute({name: 'name'}) instanceof Attribute;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
&nbsp;<b><i>should make sure new operator used:</i></b>
```javascript
/* jshint ignore:start */
Attribute({name: 'name'});
/* jshint ignore:end */
```
<blockquote><strong>Error: new operator required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>should make sure properties are valid:</i></b>
```javascript
new Attribute({name: 'name', sex: 'female'});
```
<blockquote><strong>Error: error creating Attribute: invalid property: sex</strong> thrown as expected
</blockquote>
&nbsp;<b><i>should validate and throw errors before returning from constructor:</i></b>
```javascript
new Attribute({eman: 'the'}); // 2 errors: name missing and eman an unknown property
```
<blockquote><strong>Error: error creating Attribute: multiple errors</strong> thrown as expected
</blockquote>
#### Attribute.ModelID
<p>Attribute.ModelID defines reference to ID in external model.</p>
&nbsp;<b><i>objects created should be an instance of Attribute.ModelID:</i></b>
```javascript
return new Attribute.ModelID(new Model()) instanceof Attribute.ModelID;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
&nbsp;<b><i>should make sure new operator used:</i></b>
```javascript
Attribute.ModelID();
```
<blockquote><strong>Error: new operator required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>constructor must pass instance of model:</i></b>
```javascript
new Attribute.ModelID();
```
<blockquote><strong>Error: must be constructed with Model</strong> thrown as expected
</blockquote>
&nbsp;<b><i>value is set to value of ID in constructor:</i></b>
```javascript
var model = new Model();
model.set('id', 123);
return new Attribute.ModelID(model).value;
```
<blockquote>returns <strong>123</strong> as expected
</blockquote>
&nbsp;<b><i>constructorFunction is set to constructor of model:</i></b>
```javascript
var model = new Model();
model.set('id', 123);
var attrib = new Attribute.ModelID(model);
var newModel = new attrib.constructorFunction();
return newModel instanceof Model;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
&nbsp;<b><i>modelType is set from model in constructor:</i></b>
```javascript
return new Attribute.ModelID(new Model()).modelType;
```
<blockquote>returns <strong>Model</strong> as expected
</blockquote>
&nbsp;<b><i>toString is more descriptive:</i></b>
```javascript
var model = new Model();
model.set('id', 123);
return new Attribute.ModelID(model).toString();
```
<blockquote>returns <strong>ModelID(Model:123)</strong> as expected
</blockquote>
#### PROPERTIES
#### name
&nbsp;<b><i>should be required:</i></b>
```javascript
new Attribute();
```
<blockquote><strong>Error: error creating Attribute: name required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>should allow shorthand string constructor for name property:</i></b>
```javascript
return new Attribute('favoriteActorName');
```
<blockquote>returns <strong>Attribute: favoriteActorName</strong> as expected
</blockquote>
#### type
&nbsp;<b><i>should default to 'String':</i></b>
```javascript
return new Attribute({name: 'name'}).type;
```
<blockquote>returns <strong>String</strong> as expected
</blockquote>
&nbsp;<b><i>should be a valid attribute type:</i></b>
```javascript
//spec.show(T.getAttributeTypes());
new Attribute({name: 'Bogus', type: "Dude"});
```
<blockquote><strong>Error: error creating Attribute: Invalid type: Dude</strong> thrown as expected
</blockquote>
&nbsp;<b><i>should allow shorthand string constructor for type property:</i></b>
```javascript
return new Attribute('favoriteActorBorn', 'Date').type;
```
<blockquote>returns <strong>Date</strong> as expected
</blockquote>
#### label
&nbsp;<b><i>should default to name property capitalized:</i></b>
```javascript
return new Attribute({name: 'name'}).label;
```
<blockquote>returns <strong>Name</strong> as expected
</blockquote>
&nbsp;<b><i>should be optional in constructor:</i></b>
```javascript
return new Attribute({name: 'name', label: 'Name'}).label;
```
<blockquote>returns <strong>Name</strong> as expected
</blockquote>
#### placeHolder
&nbsp;<b><i>pass through to Interface used as visual cue to user for input:</i></b>
```javascript
return new Attribute({name: 'ssn', placeHolder: '###-##-####'}).placeHolder;
```
<blockquote>returns <strong>###-##-####</strong> as expected
</blockquote>
#### hint
<p>hint properties give guidance in handling of the attribute</p>
&nbsp;<b><i>initialized to empty object:</i></b>
```javascript
return typeof new Attribute({name: 'name', label: 'Name'}).hint;
```
<blockquote>returns <strong>object</strong> as expected
</blockquote>
#### quickPick
&nbsp;<b><i>list of values to pick from typically invoked from dropdown:</i></b>
```javascript
return new Attribute({name: 'stooge', quickPick: ['moe', 'larry', 'curly']}).quickPick.length;
```
<blockquote>returns <strong>3</strong> as expected
</blockquote>
#### validationErrors
&nbsp;<b><i>Array of errors:</i></b>
```javascript
this.shouldBeTrue(new Attribute({name: 'name'}).validationErrors instanceof Array);
this.shouldBeTrue(new Attribute({name: 'name'}).validationErrors.length === 0);
```
<blockquote></blockquote>
#### validationMessage
&nbsp;<b><i>string description of error(s):</i></b>
```javascript
return new Attribute({name: 'name'}).validationMessage;
```
<blockquote></blockquote>
#### validationRule
<p>The validationRule property provides validation rules for attribute.  For additional validation see the *Validate* event in onEvent method.</p>
&nbsp;<b><i>initialized to empty object:</i></b>
```javascript
return typeof new Attribute({name: 'name'}).validationRule;
```
<blockquote>returns <strong>object</strong> as expected
</blockquote>
&nbsp;<b><i>can be passed to constructor:</i></b>
```javascript
new Attribute({name: 'name', validationRule: {}});
```
<blockquote></blockquote>
&nbsp;<b><i>validation rule is validated:</i></b>
```javascript
new Attribute({name: 'name', validationRule: {age: 18, required: true}});
```
<blockquote><strong>Error: error creating Attribute: invalid validationRule: age</strong> thrown as expected
</blockquote>
#### validationRule.required
<p>validationRule.required is used when a value is required for attribute</p>
&nbsp;<b><i>validationRule.required:</i></b>
```javascript
var a = new Attribute({name: 'name', validationRule: {required: true}});
a.validate(function () {
  callback(a.validationErrors);
});
```
<blockquote>returns <strong>Name required</strong> as expected
</blockquote>
&nbsp;<b><i>validationRule.required for Number allows 0:</i></b>
```javascript
var a = new Attribute({name: 'balance', type: 'Number', value: 0, validationRule: {required: true}});
a.validate(function () {
  callback( a.validationErrors.length);
});
```
<blockquote></blockquote>
&nbsp;<b><i>validationRule.required for Boolean allows false:</i></b>
```javascript
var a = new Attribute({name: 'active', type: 'Boolean', value: false, validationRule: {required: true}});
a.validate(function () {
  callback( a.validationErrors.length);
});
```
<blockquote></blockquote>
#### validationRule.range
<p>validationRule.range is used when value must fall within a range of values- use null to omit bound</p>
&nbsp;<b><i>validationRule.range lower bound only:</i></b>
```javascript
var a = new Attribute({name: 'age', type: 'Number', value: 17, validationRule: {range: [18, null]}});
a.validate(function () {
  callback( a.validationErrors[0]);
});
```
<blockquote>returns <strong>Age must be at least 18</strong> as expected
</blockquote>
&nbsp;<b><i>validationRule.range upper bound only:</i></b>
```javascript
var a = new Attribute({name: 'age', type: 'Number', value: 77, validationRule: {range: [null, 65]}});
a.validate(function () {
  callback( a.validationErrors[0]);
});
```
<blockquote>returns <strong>Age must be no more than 65</strong> as expected
</blockquote>
&nbsp;<b><i>validationRule.range pass:</i></b>
```javascript
var a = new Attribute({name: 'age', type: 'Number', value: 53, validationRule: {range: [18, 65]}});
a.validate(function () {
  callback( a.validationErrors.length);
});
```
<blockquote></blockquote>
&nbsp;<b><i>validationRule.range forced to array:</i></b>
```javascript
var a = new Attribute({name: 'age', type: 'Number', value: 53, validationRule: {range: 100}});
a.validate(function () {
  callback( a.validationErrors);
});
```
<blockquote>returns <strong>Age must be at least 100</strong> as expected
</blockquote>
#### validationRule.isOneOf
<p>validationRule.isOneOf is used when a value is must be on of items in array</p>
&nbsp;<b><i>validationRule.isOneOf fail:</i></b>
```javascript
var a = new Attribute({name: 'age', type: 'Number', value: 2, validationRule: {isOneOf: [1, 3]}});
a.validate(function () {
  callback( a.validationErrors[0]);
});
```
<blockquote>returns <strong>Age invalid</strong> as expected
</blockquote>
&nbsp;<b><i>validationRule.isOneOf pass:</i></b>
```javascript
var a = new Attribute({name: 'age', type: 'Number', value: 1, validationRule: {isOneOf: [1, 3]}});
a.validate(function () {
  callback( a.validationErrors.length);
});
```
<blockquote></blockquote>
#### value
&nbsp;<b><i>should accept null assignment:</i></b>
```javascript
var myTypes = Attribute.getAttributeTypes();
var record = '';
for (var i = 0; i < myTypes.length; i++) {
  record += myTypes[i] + ':' + new Attribute({name: 'my' + myTypes[i]}).value + ' ';
}
//spec.show(record);
// It's the default and it passes constructor validation
```
<blockquote></blockquote>
&nbsp;<b><i>should accept assignment of correct type and validate incorrect attributeTypes:</i></b>
```javascript
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
```
<blockquote>returns <strong>7 correct assignments 91 errors thrown</strong> as expected
</blockquote>
#### TYPES
#### ID
&nbsp;<b><i>should have type of 'ID':</i></b>
```javascript
return new Attribute({name: 'CustomerID', type: 'ID'}).type;
```
<blockquote>returns <strong>ID</strong> as expected
</blockquote>
#### String
&nbsp;<b><i>should have type of 'String':</i></b>
```javascript
return new Attribute({name: 'Cheese', type: 'String'}).type;
```
<blockquote>returns <strong>String</strong> as expected
</blockquote>
&nbsp;<b><i>should have size property:</i></b>
```javascript
// Note: size property is not "enforced" but for formatting purposes
return new Attribute({name: 'zipCode', size: 10}).size;
```
<blockquote>returns <strong>10</strong> as expected
</blockquote>
&nbsp;<b><i>size should default to 50:</i></b>
```javascript
return new Attribute({name: 'stuff'}).size;
```
<blockquote>returns <strong>50</strong> as expected
</blockquote>
&nbsp;<b><i>size should be an integer:</i></b>
```javascript
new Attribute({name: 'zipCode', size: "10"});
```
<blockquote><strong>Error: error creating Attribute: size must be a number from 1 to 255</strong> thrown as expected
</blockquote>
&nbsp;<b><i>size should be between 1 and 255:</i></b>
```javascript
this.shouldThrowError(Error('error creating Attribute: size must be a number from 1 to 255'), function () {
  new Attribute({name: 'partyLikeIts', size: 1999});
});
this.shouldThrowError(Error('error creating Attribute: size must be a number from 1 to 255'), function () {
  new Attribute({name: 'iGotNothing', size: 0});
});
```
<blockquote></blockquote>
&nbsp;<b><i>size should accept format shorthand with parens:</i></b>
```javascript
return new Attribute({name: 'comments', type: 'String(255)'}).size;
```
<blockquote>returns <strong>255</strong> as expected
</blockquote>
#### Number
&nbsp;<b><i>type should be 'Number':</i></b>
```javascript
return new Attribute({name: 'healthPoints', type: 'Number'}).type;
```
<blockquote>returns <strong>Number</strong> as expected
</blockquote>
#### Date
&nbsp;<b><i>type should be 'Date':</i></b>
```javascript
return new Attribute({name: 'born', type: 'Date'}).type;
```
<blockquote>returns <strong>Date</strong> as expected
</blockquote>
#### Boolean
&nbsp;<b><i>type should be 'Boolean':</i></b>
```javascript
return new Attribute({name: 'bored', type: 'Boolean'}).type;
```
<blockquote>returns <strong>Boolean</strong> as expected
</blockquote>
#### Model
<p>Parameter type Model is used to store a reference to another model instance.  The value attribute is a Attribute.ModelID reference to the Model.</p>
&nbsp;<b><i>must construct with Attribute.ModelID in value:</i></b>
```javascript
new Attribute({name: 'Twiggy', type: 'Model'});
```
<blockquote><strong>Error: error creating Attribute: value must be Attribute.ModelID</strong> thrown as expected
</blockquote>
&nbsp;<b><i>modelType property set from constructor:</i></b>
```javascript
return new Attribute(
  {
    name: 'Twiggy',
    type: 'Model',
    value: new Attribute.ModelID(new Model())
  }).modelType;
```
<blockquote>returns <strong>Model</strong> as expected
</blockquote>
#### Group
<p>Groups are used to keep attributes together for presentation purposes.</p>
&nbsp;<b><i>should have type of 'Group':</i></b>
```javascript
return new Attribute({name: 'stuff', type: 'Group'}).type;
```
<blockquote>returns <strong>Group</strong> as expected
</blockquote>
&nbsp;<b><i>deep check value for valid Attributes that pass getObjectStateErrors() test:</i></b>
```javascript
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
```
<blockquote>returns <strong>1</strong> as expected
</blockquote>
#### Table
<p>Table types are used to store an array of values (rows) each of which is an array of values (columns).  Each column value is associated with the corresponding element in the Table property group which is set when creating a Table.</p>
&nbsp;<b><i>should have type of 'Table':</i></b>
```javascript
var name = new Attribute("Name");
var cols = new Attribute({name: 'columns', type: 'Group', value: [name]});
return new Attribute({name: 'bills', type: 'Table', group: cols}).type;
```
<blockquote>returns <strong>Table</strong> as expected
</blockquote>
&nbsp;<b><i>group property must be defined:</i></b>
```javascript
new Attribute({name: 'details', type: 'Table'});
```
<blockquote><strong>Error: error creating Attribute: group property required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>group property must not be empty array:</i></b>
```javascript
var cols = new Attribute({name: 'columns', type: 'Group', value: []});
new Attribute({name: 'details', type: 'Table', group: cols});
```
<blockquote><strong>Error: error creating Attribute: group property value must contain at least one Attribute</strong> thrown as expected
</blockquote>
#### Object
<p>Javascript objects ... structure user defined</p>
&nbsp;<b><i>should have type of 'Object':</i></b>
```javascript
return new Attribute({name: 'stuff', type: 'Object'}).type;
```
<blockquote>returns <strong>Object</strong> as expected
</blockquote>
#### METHODS
#### toString()
&nbsp;<b><i>should return a description of the attribute:</i></b>
```javascript
return new Attribute({name: 'name'}).toString();
```
<blockquote>returns <strong>Attribute: name</strong> as expected
</blockquote>
#### coerce(newValue)
<p>Method returns the type equivalent of newValue for the owner objects type.</p>
&nbsp;<b><i>coerce method basic usage:</i></b>
```javascript
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
```
<blockquote></blockquote>
#### getObjectStateErrors
&nbsp;<b><i>should return array of validation errors:</i></b>
```javascript
this.shouldBeTrue(new Attribute({name: 'name'}).getObjectStateErrors() instanceof Array);
var nameHosed = new Attribute({name: 'name'}); // No errors
this.shouldBeTrue(nameHosed.getObjectStateErrors().length === 0);
nameHosed.name = ''; // 1 err
this.shouldBeTrue(nameHosed.getObjectStateErrors().length === 1);
nameHosed.type = ''; // 2 errors
this.shouldBeTrue(nameHosed.getObjectStateErrors().length === 2);
```
<blockquote></blockquote>
#### onEvent
<p>Use onEvent(events,callback)</p>
&nbsp;<b><i>first parameter is a string or array of event subscriptions:</i></b>
```javascript
new Attribute({name: 'name'}).onEvent();
```
<blockquote><strong>Error: subscription string or array required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>callback is required:</i></b>
```javascript
new Attribute({name: 'name'}).onEvent([]);
```
<blockquote><strong>Error: callback is required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>events are checked against known types:</i></b>
```javascript
new Attribute({name: 'name'}).onEvent(['onDrunk'], function () {
});
```
<blockquote><strong>Error: Unknown command event: onDrunk</strong> thrown as expected
</blockquote>
&nbsp;<b><i>here is a working version:</i></b>
```javascript
//spec.show(T.getAttributeEvents());
// Validate - callback when attribute needs to be validated
// StateChange -- callback when state of object (value or validation state) has changed
new Attribute({name: 'name'}).onEvent(['Validate'], function () {
});
```
<blockquote></blockquote>
#### validate
<p>check valid object state and value for attribute - invoke callback for results</p>
&nbsp;<b><i>callback is required:</i></b>
```javascript
new Attribute({name: 'name'}).validate();
```
<blockquote><strong>Error: callback is required</strong> thrown as expected
</blockquote>
#### setError
<p>Set a error condition and descriptive message</p>
&nbsp;<b><i>first argument condition required:</i></b>
```javascript
new Attribute({name: 'status'}).setError();
```
<blockquote><strong>Error: condition required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>second argument description required:</i></b>
```javascript
new Attribute({name: 'status'}).setError('login');
```
<blockquote><strong>Error: description required</strong> thrown as expected
</blockquote>
#### clearError
<p>Clear a error condition</p>
&nbsp;<b><i>first argument condition required:</i></b>
```javascript
new Attribute({name: 'status'}).clearError();
```
<blockquote><strong>Error: condition required</strong> thrown as expected
</blockquote>
#### INTEGRATION
&nbsp;<b><i>validation usage demonstrated:</i></b>
```javascript
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
```
<blockquote>returns <strong>got milk</strong> as expected
</blockquote>