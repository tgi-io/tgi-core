#tgi-core
Core objects, models, stores and interfaces.    

&nbsp;<b><i>CORE function exposes library:</i></b>
```javascript
return typeof CORE;
```
<blockquote>returns <strong>function</strong> as expected
</blockquote>
##Table of Contents

- [Attribute](#-attribute) defines data types - needed by Model
- [Command](#-command) encapsulates task execution
- [Delta](#-delta) represents changes to models
- [Interface](#-interface) enable user to communicate with app
- [List](#-list) of items
- [Message](#-message) between host and client
- [Model](#-model) abstracts entities using a collection of attributes
- [Procedure](#-procedure) manages set of Commands synchronous or asynchronous
- [Request](#-request) from Interface - Application handles response
- [Store](#-store) holds Model objects for updating and retrieving
- [Transport](#-transport) messages between client and host

#### Models
- [Application](#-application) manages active state and configuration
- [Log](#-log) information for recall
- [Presentation](#-presentation) used by Interface to render data
- [Session](#-session) for user host access
- [User](#-user) access, logging and other stuff todo with humans
- [Workspace](#-workspace) of active Models for user

#### Stores
- [MemoryStore](#-memorystore) volatile memory store in js codespace


## [&#9664;](#-tgi-core)&nbsp;[&#8984;](#table-of-contents)&nbsp;[&#9654;](#-command) &nbsp;Attribute
Attributes are the means for models to represent data of different types.  They have no dependencies on Models however and can be used without creating a model.    

#### CONSTRUCTOR
&nbsp;<b><i>objects created should be an instance of Attribute:</i></b>
```javascript
return new Attribute({name: 'name'}) instanceof Attribute;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
&nbsp;<b><i>should make sure new operator used:</i></b>
```javascript
Attribute({name: 'name'}); // jshint ignore:line
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
Attribute.ModelID is a constructor that is used as a special type for references to IDs in external models.  Note it is a function embedded as a member of the Attribute to encapsulate it.    

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
this.log(Attribute.getTypes());
new Attribute({name: 'Bogus', type: "Dude"});
```
<blockquote><strong>log: </strong>ID,String,Date,Boolean,Number,Model,Group,Table,Object<br><strong>Error: error creating Attribute: Invalid type: Dude</strong> thrown as expected
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
hint properties give guidance in handling of the attribute    

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
#### validationMessage
&nbsp;<b><i>string description of error(s) is empty string (falsy) when no errors:</i></b>
```javascript
var errs = new Attribute({name: 'name'}).validationMessage;
this.shouldBeFalsy(errs);
return cpad(errs,2,'"');
```
<blockquote>returns <strong>""</strong> as expected
</blockquote>
#### validationRule
The validationRule property provides validation rules for attribute.  For additional validation see the *Validate* event in onEvent method.    

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
&nbsp;<b><i>validation rule is validated:</i></b>
```javascript
new Attribute({name: 'name', validationRule: {age: 18, required: true}});
```
<blockquote><strong>Error: error creating Attribute: invalid validationRule: age</strong> thrown as expected
</blockquote>
#### validationRule.required
validationRule.required is used when a value is required for attribute    

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
&nbsp;<b><i>validationRule.required for Boolean allows false:</i></b>
```javascript
var a = new Attribute({name: 'active', type: 'Boolean', value: false, validationRule: {required: true}});
a.validate(function () {
  callback( a.validationErrors.length);
});
```
#### validationRule.range
validationRule.range is used when value must fall within a range of values- use null to omit bound    

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
validationRule.isOneOf is used when a value is must be on of items in array    

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
#### value
&nbsp;<b><i>should accept null assignment:</i></b>
```javascript
var myTypes = Attribute.getTypes();
var record = '';
for (var i = 0; i < myTypes.length; i++) {
  record += myTypes[i] + ':' + new Attribute({name: 'my' + myTypes[i]}).value + ' ';
}
this.log(record);
// It's the default and it passes constructor validation
```
<blockquote><strong>log: </strong>ID:null String:null Date:null Boolean:null Number:null Model:null Group:null Table:null Object:null <br></blockquote>
&nbsp;<b><i>should accept assignment of correct type and validate incorrect attributeTypes:</i></b>
```javascript
// Test all known attribute types
var myTypes = Attribute.getTypes();
myTypes.shift(); // not testing ID
myTypes.pop(); // not testing Object since it matches other types
this.log(myTypes);
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
      // NOTE: functions in loops are terrible code practices - except in dorky test cases
      this.shouldThrowError('*', function () { // jshint ignore:line
        new Attribute({name: 'my' + myTypes[i], type: myTypes[i], value: myValues[j]});
      });// jshint ignore:line
    }
    // other objects should throw always
    theBad++;
    this.shouldThrowError('*', function () { // jshint ignore:line
      new Attribute({name: 'my' + myTypes[i], type: myTypes[i], value: {}});
    }); // jshint ignore:line
  }
return theGood + ' correct assignments ' + theBad + ' errors thrown';
```
<blockquote><strong>log: </strong>String,Date,Boolean,Number,Model,Group,Table<br>returns <strong>7 correct assignments 91 errors thrown</strong> as expected
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
Parameter type Model is used to store a reference to another model instance.  The value attribute is a Attribute.ModelID reference to the Model.    

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
Groups are used to keep attributes together for presentation purposes.    

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
this.log(myStuff.getObjectStateErrors());
badApple.value = -1; // One bad apple will spoil my stuff
this.log(myStuff.getObjectStateErrors());
return myStuff.getObjectStateErrors().length;
```
<blockquote><strong>log: </strong>group contains invalid members<br><strong>log: </strong><br>returns <strong>1</strong> as expected
</blockquote>
#### Table
Table types are used to store an array of values (rows) each of which is an array of values (columns).  Each column value is associated with the corresponding element in the Table property group which is set when creating a Table.    

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
Javascript objects ... structure user defined    

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
Method returns the type equivalent of newValue for the owner objects type.    

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
//// Date {todo this will break in 2016}
this.shouldBeTrue(myDate.coerce('2/21/2015').getTime() === new Date('2/21/2015').getTime());
this.shouldBeTrue(myDate.coerce('2/21').getTime() === new Date('2/21/2015').getTime());
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
#### onEvent
Use onEvent(events,callback)    

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
this.log(Attribute.getEvents());
// Validate - callback when attribute needs to be validated
// StateChange -- callback when state of object (value or validation state) has changed
new Attribute({name: 'name'}).onEvent(['Validate'], function () {
});
```
<blockquote><strong>log: </strong>StateChange,Validate<br></blockquote>
#### validate
check valid object state and value for attribute - invoke callback for results    

&nbsp;<b><i>callback is required:</i></b>
```javascript
new Attribute({name: 'name'}).validate();
```
<blockquote><strong>Error: callback is required</strong> thrown as expected
</blockquote>
#### setError
Set a error condition and descriptive message    

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
Clear a error condition    

&nbsp;<b><i>first argument condition required:</i></b>
```javascript
new Attribute({name: 'status'}).clearError();
```
<blockquote><strong>Error: condition required</strong> thrown as expected
</blockquote>
#### Attribute.getTypes
This helper function returns an array of valid Attribute types.  This is just a function - not a prototype method.    

&nbsp;<b><i>show the types:</i></b>
```javascript
this.log(Attribute.getTypes());
```
<blockquote><strong>log: </strong>ID,String,Date,Boolean,Number,Model,Group,Table,Object<br></blockquote>
#### Attribute.getEvents
This helper function returns an array of valid Attribute events.  This is just a function - not a prototype method.    

&nbsp;<b><i>show the events:</i></b>
```javascript
this.log(Attribute.getEvents());
```
<blockquote><strong>log: </strong>StateChange,Validate<br></blockquote>
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
## [&#9664;](#-attribute)&nbsp;[&#8984;](#table-of-contents)&nbsp;[&#9654;](#-delta) &nbsp;Command
Command is an abstraction for command execution.  It provides for multi methods of task executionand control over invocation and state monitoring.  The primary use is to have a simple API method to respond to UI tasks.  It can be used for processing / validation / storage / reporting type of use cases since it handles the asynchronous nature of javascript and abstracts in a way to easily incorporate application logic.    

#### CONSTRUCTOR
&nbsp;<b><i>objects created should be an instance of Command:</i></b>
```javascript
return new Command({name: 'about'}) instanceof Command;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
&nbsp;<b><i>should make sure new operator used:</i></b>
```javascript
Command({name: 'about'}); // jshint ignore:line
```
<blockquote><strong>Error: new operator required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>should make sure argument properties are valid:</i></b>
```javascript
new Command({name: 'name', sex: 'female'});
```
<blockquote><strong>Error: error creating Command: invalid property: sex</strong> thrown as expected
</blockquote>
&nbsp;<b><i>defaults name to (unnamed):</i></b>
```javascript
return new Command().name;
```
<blockquote>returns <strong>(unnamed)</strong> as expected
</blockquote>
&nbsp;<b><i>defaults type to Stub:</i></b>
```javascript
return new Command({name: 'about'}).type;
```
<blockquote>returns <strong>Stub</strong> as expected
</blockquote>
#### PROPERTIES
#### name
&nbsp;<b><i>identifier name for command:</i></b>
```javascript
this.shouldThrowError(Error('name must be string'), function () {
  new Command({name: 42});
});
return new Command({name: 'about'}).name;
```
<blockquote>returns <strong>about</strong> as expected
</blockquote>
#### description
&nbsp;<b><i>more descriptive than name (for menus):</i></b>
```javascript
// description set to (name) Command if not specified
return new Command({name: 'Tequila'}).description + ' : ' +
  new Command({name: 'tequila', description: 'Tequila is a beverage made from blue agave.'}).description;
```
<blockquote>returns <strong>Tequila Command : Tequila is a beverage made from blue agave.</strong> as expected
</blockquote>
#### type
&nbsp;<b><i>type of command must be valid:</i></b>
```javascript
this.log(Command.getTypes());
new Command({name: 'about', type: 'magic'});
```
<blockquote><strong>log: </strong>ID,String,Date,Boolean,Number,Model,Group,Table,Object<br><strong>Error: Invalid command type: magic</strong> thrown as expected
</blockquote>
#### contents
Contents is based on the type of command.  See TYPE section for more information for how it applies to each type    

#### scope
Optional scope property can be used to apply a model or list to a command.    

&nbsp;<b><i>scope must be a Model or a List:</i></b>
```javascript
new Command({name: 'archiveData', scope: true});
```
<blockquote><strong>Error: optional scope property must be Model or List</strong> thrown as expected
</blockquote>
#### status
The status property is a Number defined as negative(FAIL) positive(SUCCESS) zero(executing) null/undefined(not executing).    

Applications can give meaning to numeric values (lt -1 and gt 1) as long as sign is retained.    

#### timeout
Will use library setting as default, override to set the default timeout for steps used in procedures. Value is milliseconds (1000 = 1 second)    

&nbsp;<b><i>number required:</i></b>
```javascript
new Command({name: 'options', timeout: true});
```
<blockquote><strong>Error: timeout must be a Number</strong> thrown as expected
</blockquote>
#### theme
Valid themes listed in example.  These were inspired by bootstrap so fit that well and is optional for implementation but should follow if possible.  Example PDF is b/w and may ignore ot more likely will never apply.    

&nbsp;<b><i>theme attribute provides visual cue:</i></b>
```javascript
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
```
#### icon
The icon attribute gives a graphical association to the command. They are interface specific and do break the abstractness of this library but can be ignored by other interfaces safely.    

&nbsp;<b><i>must be string and have prefix for 2 supported icon sets http://glyphicons.com/ http://fontawesome.io/:</i></b>
```javascript
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
```
#### bucket
&nbsp;<b><i>valid property is for app use:</i></b>
```javascript
// no real test but library will never use this word in general (TODO expand somehow ... ?).
return 'bucket of ' + new Command({bucket: 'KFC'}).bucket;
```
<blockquote>returns <strong>bucket of KFC</strong> as expected
</blockquote>
#### TYPES
#### menu
The menu command is passed to _Interface_ for use for in user navigation.  They are embedded in the _Application_ as the primary navigate but can be instantiated and given to _Interface_ in any context.    

The _Command_ contents property is an array _Command_ objects.    

&nbsp;<b><i>constructor validates the contents:</i></b>
```javascript
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
new Command({
  name: 'options', type: 'Menu', contents: [
    'Stooges',                      // strings act as menu titles or non selectable choices
    '-',                            // dash is menu separator
    new Command({name: 'Tequila'})  // use commands for actual menu items
  ]
});
```
#### Presentation
&nbsp;<b><i>for Presentation type contents is a Presentation object:</i></b>
```javascript
this.shouldThrowError(Error('contents must be a Presentation'), function () {
  new Command({name: 'options', type: 'Presentation'});
});
```
#### Function
contents contains a javascript function    

&nbsp;<b><i>for Function type contents is a Function:</i></b>
```javascript
this.shouldThrowError(Error('contents must be a Function'), function () {
  new Command({name: 'options', type: 'Function'});
});
```
#### Procedure
&nbsp;<b><i>for Procedure type contents is a Procedure object:</i></b>
```javascript
this.shouldThrowError(Error('contents must be a Procedure'), function () {
  new Command({name: 'options', type: 'Procedure'});
});
```
#### METHODS
#### toString
&nbsp;<b><i>returns string including name and type:</i></b>
```javascript
return 'I am a ' + new Command({name: 'Customer'});
```
<blockquote>returns <strong>I am a Stub Command: Customer</strong> as expected
</blockquote>
#### abort
aborts task    

&nbsp;<b><i>aborted command ends with error status:</i></b>
```javascript
var cmd = new Command();
cmd.abort();
return cmd.status;
```
<blockquote>returns <strong>-1</strong> as expected
</blockquote>
#### complete
completes task    

&nbsp;<b><i>call when task complete status:</i></b>
```javascript
var cmd = new Command();
cmd.complete();
return cmd.status;
```
<blockquote>returns <strong>1</strong> as expected
</blockquote>
#### execute
executes task    

&nbsp;<b><i>see integration tests:</i></b>
```javascript
new Command().execute();
```
<blockquote><strong>Error: command type Stub not implemented</strong> thrown as expected
</blockquote>
#### onEvent
Use onEvent(events,callback)    

&nbsp;<b><i>first parameter is a string or array of event subscriptions:</i></b>
```javascript
new Command().onEvent();
```
<blockquote><strong>Error: subscription string or array required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>callback is required:</i></b>
```javascript
new Command().onEvent([]);
```
<blockquote><strong>Error: callback is required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>events are checked against known types:</i></b>
```javascript
new Command().onEvent(['onDrunk'], function () {
});
```
<blockquote><strong>Error: Unknown command event: onDrunk</strong> thrown as expected
</blockquote>
&nbsp;<b><i>here is a working version:</i></b>
```javascript
this.log(Command.getEvents());
//  BeforeExecute - callback called before first task executed but after tasks initialized
//  AfterExecute - callback called after initial task(s) launched (see onCompletion)
//  Error - error occurred (return {errorClear:true})
//  Aborted - procedure aborted - should clean up resources
//  Completed - execution is complete check status property
new Command().onEvent(['Completed'], function () {
});
```
<blockquote><strong>log: </strong>BeforeExecute,AfterExecute,Error,Aborted,Completed<br></blockquote>
#### Command.getTypes
This helper function returns an array of valid Command types.  This is just a function - not a prototype method.    

&nbsp;<b><i>show the types:</i></b>
```javascript
this.log(Command.getTypes());
```
<blockquote><strong>log: </strong>ID,String,Date,Boolean,Number,Model,Group,Table,Object<br></blockquote>
#### Command.getEvents
This helper function returns an array of valid Command events.  This is just a function - not a prototype method.    

&nbsp;<b><i>show the events:</i></b>
```javascript
this.log(Command.getEvents());
```
<blockquote><strong>log: </strong>BeforeExecute,AfterExecute,Error,Aborted,Completed<br></blockquote>
#### INTEGRATION
test each command type    

&nbsp;<b><i>Stub:</i></b>
```javascript
var cmd = new Command({
  name: 'stubCommand',
  description: 'stub command test',
  type: 'Stub'
});
this.log(cmd);
cmd.execute();
```
<blockquote><strong>log: </strong>Stub Command: stubCommand<br><strong>Error: command type Stub not implemented</strong> thrown as expected
</blockquote>
&nbsp;<b><i>Menu:</i></b>
```javascript
var cmd = new Command({
  name: 'menuCommand',
  description: 'menu command test',
  type: 'Menu',
  contents: ['Hello World']
});
this.log(cmd);
cmd.execute();
```
<blockquote><strong>log: </strong>Menu Command: menuCommand<br><strong>Error: command type Menu not implemented</strong> thrown as expected
</blockquote>
&nbsp;<b><i>Presentation:</i></b>
```javascript
var cmd = new Command({
  name: 'presentationCommand',
  description: 'presentation command test',
  type: 'Presentation',
  contents: new Presentation()
});
this.shouldThrowError(Error('contents must be a Presentation'), function () {
  cmd.contents = 123;
  cmd.execute();
});
this.shouldThrowError(Error('error executing Presentation: contents elements must be Command, Attribute or string'), function () {
  cmd.contents = new Presentation();
  cmd.contents.set('contents', [new Command(), new Attribute({name: 'meh'}), true]);
  cmd.execute();
});
```
&nbsp;<b><i>Function test straight up:</i></b>
```javascript
var cmd = new Command({
  type: 'Function',
  contents: function () {
    this.bucket += ' funk';
    this.complete();
  }
});
cmd.bucket = 'Hola!';
// Monitor all events
cmd.onEvent(['BeforeExecute', 'AfterExecute', 'Error', 'Aborted', 'Completed'], function (event) {
  this.bucket += ' ' + event;
  if (event == 'Completed')
    callback(this.bucket);
});
cmd.execute();
cmd.bucket += ' Adious!';
```
<blockquote>returns <strong>Hola! BeforeExecute AfterExecute Adious! funk Completed</strong> as expected
</blockquote>
&nbsp;<b><i>Function test with error:</i></b>
```javascript
var cmd = new Command({
  type: 'Function',
  contents: function () {
    this.bucket += ' funk';
    throw new Error('function go boom!');
  }
});
cmd.bucket = 'Hola!';
// Monitor all events
cmd.onEvent('*', function (event) { // * for all events
  this.bucket += ' ' + event;
  if (event == 'Completed') callback(this.bucket);
});
cmd.execute();
cmd.bucket += ' Adious!';
```
<blockquote>returns <strong>Hola! BeforeExecute AfterExecute Adious! funk Error Completed</strong> as expected
</blockquote>
&nbsp;<b><i>Function test with abort:</i></b>
```javascript
var cmd = new Command({
  type: 'Function',
  contents: function () {
    this.bucket += ' funk';
    this.abort();
  }
});
cmd.bucket = 'Hola!';
// Monitor all events
cmd.onEvent(['BeforeExecute', 'AfterExecute', 'Error', 'Aborted', 'Completed'], function (event) {
  this.bucket += ' ' + event;
  if (event == 'Completed') callback(this.bucket);
});
cmd.execute();
cmd.bucket += ' Adious!';
```
<blockquote>returns <strong>Hola! BeforeExecute AfterExecute Adious! funk Aborted Completed</strong> as expected
</blockquote>
&nbsp;<b><i>Procedure:</i></b>
```javascript
var cmd = new Command({
  name: 'procedureCommand',
  description: 'procedure command test',
  type: 'Procedure',
  contents: new Procedure()
});
this.log(cmd);
cmd.execute();
// Better example: https://github.com/tgicloud/tgi-core/tree/master/spec#-procedure
```
<blockquote><strong>log: </strong>Procedure Command: procedureCommand<br></blockquote>
## [&#9664;](#-command)&nbsp;[&#8984;](#table-of-contents)&nbsp;[&#9654;](#-interface) &nbsp;Delta
Deltas represent changes to models.  They can be applied to a store then update the model.  They can be stored in logs as a change audit for the model.    

#### CONSTRUCTOR
&nbsp;<b><i>objects created should be an instance of Delta:</i></b>
```javascript
return new Delta(new Attribute.ModelID(new Model())) instanceof Delta;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
&nbsp;<b><i>should make sure new operator used:</i></b>
```javascript
Delta(); // jshint ignore:line
```
<blockquote><strong>Error: new operator required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>Attribute.ModelID required in constructor:</i></b>
```javascript
new Delta();
```
<blockquote><strong>Error: Attribute.ModelID required in constructor</strong> thrown as expected
</blockquote>
#### PROPERTIES
#### dateCreated
&nbsp;<b><i>set to current date/time on creation:</i></b>
```javascript
var delta = new Delta(new Attribute.ModelID(new Model()));
this.log(delta.dateCreated);
return delta.dateCreated instanceof Date;
```
<blockquote><strong>log: </strong>Sat Jan 03 2015 22:24:32 GMT-0500 (EST)<br>returns <strong>true</strong> as expected
</blockquote>
#### modelID
&nbsp;<b><i>set from constructor:</i></b>
```javascript
var delta = new Delta(new Attribute.ModelID(new Model()));
this.log(delta.dateCreated);
return delta.modelID.toString();
```
<blockquote><strong>log: </strong>Sat Jan 03 2015 22:24:32 GMT-0500 (EST)<br>returns <strong>ModelID(Model:null)</strong> as expected
</blockquote>
#### attributeValues
&nbsp;<b><i>created as empty object:</i></b>
```javascript
// attributeValues - {attribute:[before,after]}  before and after attribute values represent the model
// attribute value changes. If the model attribute is type Table then attributeValues is array of
// attributeValues corresponding to model -> attribute -> group....
return typeof new Delta(new Attribute.ModelID(new Model())).attributeValues;
```
<blockquote>returns <strong>object</strong> as expected
</blockquote>
## [&#9664;](#-delta)&nbsp;[&#8984;](#table-of-contents)&nbsp;[&#9654;](#-list) &nbsp;Interface
The Interface core constructor is a prototype for user or system interaction with the application. The SurrogateInterface is a reference to Interface being tested in the suite.    

#### CONSTRUCTOR
&nbsp;<b><i>objects created should be an instance of SurrogateInterface:</i></b>
```javascript
var i = new SurrogateInterface();
return (i instanceof SurrogateInterface) && (i instanceof Interface);
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
&nbsp;<b><i>should make sure new operator used:</i></b>
```javascript
SurrogateInterface(); // jshint ignore:line
```
<blockquote><strong>Error: new operator required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>should make sure argument properties are valid:</i></b>
```javascript
new SurrogateInterface({yo: 'whatup'});
```
<blockquote><strong>Error: error creating Procedure: invalid property: yo</strong> thrown as expected
</blockquote>
#### PROPERTIES
#### name
&nbsp;<b><i>defaults to (unnamed):</i></b>
```javascript
return new SurrogateInterface().name;
```
<blockquote>returns <strong>(unnamed)</strong> as expected
</blockquote>
#### description
&nbsp;<b><i>defaults to a SurrogateInterface:</i></b>
```javascript
return new SurrogateInterface().description;
```
<blockquote>returns <strong>a Interface</strong> as expected
</blockquote>
#### METHODS
#### toString()
&nbsp;<b><i>should return a description of the message:</i></b>
```javascript
return new SurrogateInterface({description: 'Punched Card SurrogateInterface'}).toString();
```
<blockquote>returns <strong>Punched Card SurrogateInterface</strong> as expected
</blockquote>
#### start()
The start method initiates the interface and passes a callback for the interface to submit requests. The callback must pass a Request object followed by an optional callback for responses to the request e.g. interface.start ( function ( request, response(callback) ) ) {}    

&nbsp;<b><i>Application parameter is required:</i></b>
```javascript
new SurrogateInterface().start();
```
<blockquote><strong>Error: Application required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>presentation parameter is required:</i></b>
```javascript
new SurrogateInterface().start(new Application());
```
<blockquote><strong>Error: presentation required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>callback parameter required:</i></b>
```javascript
new SurrogateInterface().start(new Application(), new Presentation());
```
<blockquote><strong>Error: callBack required</strong> thrown as expected
</blockquote>
#### stop()
calling stop will end the start() processing and release any resources    

&nbsp;<b><i>must pass callback function:</i></b>
```javascript
new SurrogateInterface().stop();
```
<blockquote><strong>Error: callBack required</strong> thrown as expected
</blockquote>
#### dispatch()
The dispatch method will accept a request and act on it or pass it to the app.    

&nbsp;<b><i>must pass a Request object:</i></b>
```javascript
new SurrogateInterface().dispatch();
```
<blockquote><strong>Error: Request required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>send command without callback when no response needed:</i></b>
```javascript
new SurrogateInterface().dispatch(new Request({type: 'Command', command: new Command()}));
```
&nbsp;<b><i>optional second parameter is the response callback:</i></b>
```javascript
new SurrogateInterface().dispatch(new Request({type: 'Command', command: new Command()}), true);
```
<blockquote><strong>Error: response callback is not a function</strong> thrown as expected
</blockquote>
#### notify()
The notify method sends a Request to the Interface.  This can be the result of a request sent from the start() callback.    

&nbsp;<b><i>must pass a Request object:</i></b>
```javascript
new SurrogateInterface().notify();
```
<blockquote><strong>Error: Request required</strong> thrown as expected
</blockquote>
#### render()
&nbsp;<b><i>first argument must be a Presentation instance:</i></b>
```javascript
new SurrogateInterface().render();
```
<blockquote><strong>Error: Presentation object required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>optional callback must be function:</i></b>
```javascript
new SurrogateInterface().render(new Presentation(), true);
```
<blockquote><strong>Error: optional second argument must a commandRequest callback function</strong> thrown as expected
</blockquote>
#### canMock()
&nbsp;<b><i>returns boolean to indicate if interface has mocking ability:</i></b>
```javascript
var canMock = new SurrogateInterface().canMock();
return typeof canMock;
```
<blockquote>returns <strong>boolean</strong> as expected
</blockquote>
#### mockRequest()
&nbsp;<b><i>parameter must be request or array of requests:</i></b>
```javascript
var ui = new SurrogateInterface();
this.shouldThrowError('Error: missing request parameter', function () {
  ui.mockRequest();
});
// Empty Stub Commands are ignored in mocks
ui.mockRequest(new Request(new Command())); // Send single command
ui.mockRequest([new Request(new Command()), new Request(new Command())]); // Send array of commands
// Test when one of array elements is bad
this.shouldThrowError('Error: invalid request parameter', function () {
  ui.mockRequest([new Request(new Command()), 'wtf']);
});
```
#### yesno(prompt, callBack)
Query user with a yes no question.    

&nbsp;<b><i>must set interface before invoking:</i></b>
```javascript
new Application().yesno();
```
<blockquote><strong>Error: interface not set</strong> thrown as expected
</blockquote>
&nbsp;<b><i>must provide the text question param:</i></b>
```javascript
var myApplication = new Application();
myApplication.setInterface(new Interface());
myApplication.yesno();
```
<blockquote><strong>Error: prompt required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>must provide callback param:</i></b>
```javascript
var myApplication = new Application();
myApplication.setInterface(new Interface());
myApplication.yesno('Who moved my cheese?');
```
<blockquote><strong>Error: callBack required</strong> thrown as expected
</blockquote>
#### ok(prompt, callBack)
Pause before proceeding    

&nbsp;<b><i>must set interface before invoking:</i></b>
```javascript
new Application().ok();
```
<blockquote><strong>Error: interface not set</strong> thrown as expected
</blockquote>
&nbsp;<b><i>must provide the text prompt param:</i></b>
```javascript
var myApplication = new Application();
myApplication.setInterface(new Interface());
myApplication.ok();
```
<blockquote><strong>Error: prompt required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>must provide callback param:</i></b>
```javascript
var myApplication = new Application();
myApplication.setInterface(new Interface());
myApplication.ok('You are about to enter the twilight zone.');
```
<blockquote><strong>Error: callBack required</strong> thrown as expected
</blockquote>
#### ask(prompt, attribute, callBack)
Simple single item prompt.    

&nbsp;<b><i>must provide the text question param:</i></b>
```javascript
new Interface().ask();
```
<blockquote><strong>Error: prompt required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>must supply attribute:</i></b>
```javascript
new Interface().ask('What it do');
```
<blockquote><strong>Error: instance of Attribute a required parameter</strong> thrown as expected
</blockquote>
&nbsp;<b><i>must provide callback param:</i></b>
```javascript
new Interface().ask('Please enter your name', new Attribute({name: 'Name'}));
```
<blockquote><strong>Error: callBack required</strong> thrown as expected
</blockquote>
#### choose(prompt, choices, callBack)
prompt to choose an item    

&nbsp;<b><i>must provide text prompt first:</i></b>
```javascript
new Interface().choose();
```
<blockquote><strong>Error: prompt required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>must supply array of choices:</i></b>
```javascript
this.shouldThrowError(Error('choices array required'), function () {
  new Interface().choose('What it do');
});
this.shouldThrowError(Error('choices array required'), function () {
  new Interface().choose('this will not', 'work');
});
this.shouldThrowError(Error('choices array empty'), function () {
  new Interface().choose('empty array?', []);
});
```
&nbsp;<b><i>must provide callback param:</i></b>
```javascript
new Interface().choose('choose wisely', ['rock', 'paper', 'scissors']);
```
<blockquote><strong>Error: callBack required</strong> thrown as expected
</blockquote>
#### Interface Integration
&nbsp;<b><i>Test command execution mocking:</i></b>
```javascript
// Send 4 mocks and make sure we get 4 callback calls
var self = this;
self.callbackCount = 0;
var testInterface = new Interface();
testInterface.start(new Application(), new Presentation(), function (request) {
  if (request.type == 'mock count')
    self.callbackCount++;
  if (self.callbackCount > 3)
    callback(true);
});
var cmds = [];
var i;
for (i = 0; i < 4; i++) {
  cmds.push(new Request('mock count'));
}
testInterface.mockRequest(cmds);
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
## [&#9664;](#-interface)&nbsp;[&#8984;](#table-of-contents)&nbsp;[&#9654;](#-message) &nbsp;List
Lists are an ordered collection of items.  Each item is an array of values that correspond to the attributes for model used in constructor.    

#### CONSTRUCTOR
Creation of all Collections must adhere to following examples:    

&nbsp;<b><i>objects created should be an instance of List:</i></b>
```javascript
return new SurrogateListClass(new Model()) instanceof List;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
&nbsp;<b><i>should make sure new operator used:</i></b>
```javascript
List(); // jshint ignore:line
```
<blockquote><strong>Error: new operator required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>must be instantiated with model parameter.  The model attributes represent the list columns.:</i></b>
```javascript
new List();
```
<blockquote><strong>Error: argument required: model</strong> thrown as expected
</blockquote>
#### PROPERTIES
#### METHODS
#### length()
&nbsp;<b><i>length method returns the number of items in the list.:</i></b>
```javascript
return new List(new Model()).length();
```
#### clear()
&nbsp;<b><i>clear the list.:</i></b>
```javascript
return new List(new Model()).addItem(new Model()).clear().length();
```
#### get(attributeName)
Gets value of attribute for given item.    

&nbsp;<b><i>throws error if no current item:</i></b>
```javascript
new List(new Model()).get('id'); // see integration tests
```
<blockquote><strong>Error: list is empty</strong> thrown as expected
</blockquote>
#### set(attributeName,value)
Sets value of attribute for given item.    

&nbsp;<b><i>throws error if no current item:</i></b>
```javascript
new List(new Model()).set('id'); // see integration tests
```
<blockquote><strong>Error: list is empty</strong> thrown as expected
</blockquote>
&nbsp;<b><i>throws an error if the attribute does not exists:</i></b>
```javascript
var list = new List(new Model());
list.addItem(new Model());
list.set('whatever');
```
<blockquote><strong>Error: attribute not valid for list model</strong> thrown as expected
</blockquote>
#### addItem()
&nbsp;<b><i>add item to list verify length is correct.:</i></b>
```javascript
var list = new List(new Model());
return list.addItem(new Model()).length(); // returns ref for method chaining
```
<blockquote>returns <strong>1</strong> as expected
</blockquote>
#### removeItem()
&nbsp;<b><i>add then item to list verify length is correct.:</i></b>
```javascript
var list = new List(new Model());
return list.addItem(new Model()).removeItem().length(); // returns ref for method chaining
```
#### moveNext()
&nbsp;<b><i>move to next item in list:</i></b>
```javascript
return new List(new Model()).moveNext(); // Returns true when move succeeds
```
#### movePrevious()
&nbsp;<b><i>move to the previous item in list:</i></b>
```javascript
return new List(new Model()).movePrevious(); // Returns true when move succeeds
```
#### moveFirst()
&nbsp;<b><i>move to the first item in list:</i></b>
```javascript
return new List(new Model()).moveFirst(); // Returns true when move succeeds
```
#### moveLast()
&nbsp;<b><i>move to the last item in list:</i></b>
```javascript
return new List(new Model()).moveLast(); // Returns true when move succeeds
```
#### sort(key)
&nbsp;<b><i>sort 1,2 in reverse order and return first element:</i></b>
```javascript
new List(new Model()).sort(); // see integration tests
```
<blockquote><strong>Error: sort order required</strong> thrown as expected
</blockquote>
#### List Integration
#### List methods are tested here
&nbsp;<b><i>list movement and sorting:</i></b>
```javascript
var test = this;
// Create actor class
var Actor = function (args) {
  Model.call(this, args);
  this.modelType = "Actor";
  this.attributes.push(new Attribute('name'));
  this.attributes.push(new Attribute('born', 'Number'));
  this.attributes.push(new Attribute('isMale', 'Boolean'));
};
Actor.prototype = inheritPrototype(Model.prototype);
// Create list of actors
var actor = new Actor();
var actors = new List(actor);
var actorsInfo = [
  // Actor              Born  Male
  ['Jack Nicholson', 1937, true],
  ['Meryl Streep', 1949, false],
  ['Marlon Brando', 1924, true],
  ['Cate Blanchett', 1969, false],
  ['Robert De Niro', 1943, true],
  ['Judi Dench', 1934, false],
  ['Al Pacino', 1940, true],
  ['Nicole Kidman', 1967, false],
  ['Daniel Day-Lewis', 1957, true],
  ['Shirley MacLaine', 1934, false],
  ['Dustin Hoffman', 1937, true],
  ['Jodie Foster', 1962, false],
  ['Tom Hanks', 1956, true],
  ['Kate Winslet', 1975, false],
  ['Anthony Hopkins', 1937, true],
  ['Angelina Jolie', 1975, false],
  ['Paul Newman', 1925, true],
  ['Sandra Bullock', 1964, false],
  ['Denzel Washington', 1954, true],
  ['Renée Zellweger', 1969, false]
];
// Build List
for (var i in actorsInfo) {
  if (actorsInfo.hasOwnProperty(i)) {
    if (actorsInfo[i][2]) { // for some populate model then add to list
      actor.set('name', actorsInfo[i][0]);
      actor.set('born', actorsInfo[i][1]);
      actor.set('isMale', actorsInfo[i][2]);
      actors.addItem(actor);
    } else {
      actors.addItem(); // add blank then set attribs
      actors.set('name', actorsInfo[i][0]);
      actors.set('born', actorsInfo[i][1]);
      actors.set('isMale', actorsInfo[i][2]);
    }
  }
}
// Test movement thru list
actors.moveFirst();
test.shouldBeTrue(actors.get('name') == 'Jack Nicholson');
actors.moveNext();
test.log(actors.get('name'));
test.shouldBeTrue(actors.get('name') == 'Meryl Streep');
actors.moveLast();
test.log(actors.get('name'));
test.shouldBeTrue(actors.get('name') == 'Renée Zellweger');
// Sort the list
actors.sort({born: -1});  // Youngest actor
actors.moveFirst();
test.shouldBeTrue(actors.get('name') == 'Kate Winslet' || actor.get('name') == 'Angelina Jolie');
actors.sort({born: 1});  // Oldest actor
actors.moveFirst();
test.shouldBeTrue(actors.get('name') == 'Marlon Brando');
```
<blockquote><strong>log: </strong>Renée Zellweger<br><strong>log: </strong>Meryl Streep<br></blockquote>
&nbsp;<b><i>Test variations on getList method.:</i></b>
```javascript
var test = this;
var storeBeingTested = new SurrogateStore();
test.log(storeBeingTested);
// Create list of actors
test.actorsInfo = [
  // Actor Born Male Oscards
  ['Jack Nicholson', new Date("01/01/1937"), true, 3],
  ['Meryl Streep', new Date("01/01/1949"), false, 3],
  ['Marlon Brando', new Date("01/01/1924"), true, 2],
  ['Cate Blanchett', new Date("01/01/1969"), false, 1],
  ['Robert De Niro', new Date("01/01/1943"), true, 2],
  ['Judi Dench', new Date("01/01/1934"), false, 1],
  ['Al Pacino', new Date("01/01/1940"), true, 1],
  ['Nicole Kidman', new Date("01/01/1967"), false, null],
  ['Daniel Day-Lewis', new Date("01/01/1957"), true, null],
  ['Shirley MacLaine', new Date("01/01/1934"), false, null],
  ['Dustin Hoffman', new Date("01/01/1937"), true, null],
  ['Jodie Foster', new Date("01/01/1962"), false, null],
  ['Tom Hanks', new Date("01/01/1956"), true, null],
  ['Kate Winslet', new Date("01/01/1975"), false, null],
  ['Anthony Hopkins', new Date("01/01/1937"), true, null],
  ['Angelina Jolie', new Date("01/01/1975"), false, null],
  ['Paul Newman', new Date("01/01/1925"), true, null],
  ['Sandra Bullock', new Date("01/01/1964"), false, null],
  ['Denzel Washington', new Date("01/01/1954"), true, null],
  ['Renée Zellweger', new Date("01/01/1969"), false, null]
];
// Create actor class
test.Actor = function (args) {
  Model.call(this, args);
  this.modelType = "Actor";
  this.attributes.push(new Attribute('name'));
  this.attributes.push(new Attribute('born', 'Date'));
  this.attributes.push(new Attribute('isMale', 'Boolean'));
  this.attributes.push(new Attribute('oscarWs', 'Number'));
};
test.Actor.prototype = inheritPrototype(Model.prototype);
test.actor = new test.Actor(); // instance to use for stuff
// Make sure store starts in known state.  Stores such as mongoStore will retain test values.
// So... use getList to get all Actors then delete them from the Store
test.list = new List(new test.Actor());
test.oldActorsKilled = 0;
test.oldActorsFound = 0;
try {
  test.killhim = new test.Actor();
  storeBeingTested.getList(test.list, [], function (list, error) {
    if (typeof error != 'undefined') {
      callback(error);
      return;
    }
    if (list._items.length < 1)
      storeActors();
    else {
      test.oldActorsFound = list._items.length;
      for (var i = 0; i < list._items.length; i++) {
        test.killhim.set('id', list._items[i][0]);
        // jshint ignore:start
        storeBeingTested.deleteModel(test.killhim, function (model, error) {
          if (++test.oldActorsKilled >= test.oldActorsFound) {
            storeActors();
          }
        })
        // jshint ignore:end
      }
    }
  });
}
catch (err) {
  callback(err);
  return;
}
// Callback after model cleaned
// now, build List and add to store
function storeActors() {
  test.actorsStored = 0;
  for (var i = 0; i < test.actorsInfo.length; i++) {
    test.actor.set('ID', null);
    test.actor.set('name', test.actorsInfo[i][0]);
    test.actor.set('born', test.actorsInfo[i][1]);
    test.actor.set('isMale', test.actorsInfo[i][2]);
    storeBeingTested.putModel(test.actor, actorStored);
  }
}
// Callback after actor stored
function actorStored(model, error) {
  if (typeof error != 'undefined') {
    callback(error);
    return;
  }
  if (++test.actorsStored >= test.actorsInfo.length) {
    getAllActors();
  }
}
// test getting all 20
function getAllActors() {
  try {
    storeBeingTested.getList(test.list, {}, function (list, error) {
      if (typeof error != 'undefined') {
        callback(error);
        return;
      }
      test.shouldBeTrue(list._items.length == 20, '20');
      getTomHanks();
    });
  }
  catch (err) {
    callback(err);
    return;
  }
}
// only one Tom Hanks
function getTomHanks() {
  try {
    storeBeingTested.getList(test.list, {name: "Tom Hanks"}, function (list, error) {
      if (typeof error != 'undefined') {
        callback(error);
        return;
      }
      test.shouldBeTrue(list._items.length == 1, ('1 not ' + list._items.length));
      getD();
    });
  }
  catch (err) {
    callback(err);
    return;
  }
}
// 3 names begin with D
// test RegExp
function getD() {
  try {
    storeBeingTested.getList(test.list, {name: /^D/}, function (list, error) {
      if (typeof error != 'undefined') {
        callback(error);
        return;
      }
      test.shouldBeTrue(list._items.length == 3, ('3 not ' + list._items.length));
      getRZ();
    });
  }
  catch (err) {
    callback(err);
    return;
  }
}
// Renée Zellweger only female starting name with 'R'
// test filter 2 properties (logical AND)
function getRZ() {
  try {
    storeBeingTested.getList(test.list, {name: /^R/, isMale: false}, function (list, error) {
      if (typeof error != 'undefined') {
        callback(error);
        return;
      }
      test.shouldBeTrue(list._items.length == 1, ('1 not ' + list._items.length));
      //list._items.length && test.shouldBeTrue(list.get('name') == 'Renée Zellweger','rz');
      getAlphabetical();
    });
  }
  catch (err) {
    callback(err);
    return;
  }
}
// Retrieve list alphabetically by name
// test order parameter
function getAlphabetical() {
  try {
    storeBeingTested.getList(test.list, {}, {name: 1}, function (list, error) {
      if (typeof error != 'undefined') {
        callback(error);
        return;
      }
      // Verify each move returns true when move succeeds
      //test.shouldBeTrue(list.moveFirst(),'moveFirst');
      //test.shouldBeTrue(!list.movePrevious(),'movePrevious');
      //test.shouldBeTrue(list.get('name') == 'Al Pacino','AP');
      //test.shouldBeTrue(list.moveLast(),'moveLast');
      //test.shouldBeTrue(!list.moveNext(),'moveNext');
      //test.shouldBeTrue(list.get('name') == 'Tom Hanks','TH');
      callback(true);
    });
  }
  catch (err) {
    callback(err);
    return;
  }
}
```
<blockquote><strong>log: </strong>a MemoryStore<br>returns <strong>true</strong> as expected
</blockquote>
## [&#9664;](#-list)&nbsp;[&#8984;](#table-of-contents)&nbsp;[&#9654;](#-model) &nbsp;Message
#### Message Class
Messages are used by Transport to send to host or UI.    

#### CONSTRUCTOR
&nbsp;<b><i>objects created should be an instance of Message:</i></b>
```javascript
return new Message('Null') instanceof Message;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
&nbsp;<b><i>should make sure new operator used:</i></b>
```javascript
Message('Null'); // jshint ignore:line
```
<blockquote><strong>Error: new operator required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>first parameter is required:</i></b>
```javascript
new Message();
```
<blockquote><strong>Error: message type required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>first parameter must be valid message type:</i></b>
```javascript
new Message('http://www.youtube.com/watch?v=2o7V1f7lbk4');
```
<blockquote><strong>Error: Invalid message type: http://www.youtube.com/watch?v=2o7V1f7lbk4</strong> thrown as expected
</blockquote>
#### METHODS
#### toString()
&nbsp;<b><i>should return a description of the message:</i></b>
```javascript
return new Message('Null').toString();
```
<blockquote>returns <strong>Null Message</strong> as expected
</blockquote>
#### Attribute.getTypes
This helper function returns an array of valid Message types.  This is just a function - not a prototype method.    

&nbsp;<b><i>show the types:</i></b>
```javascript
this.log(Message.getTypes());
```
<blockquote><strong>log: </strong>Null,Connected,Error,Sent,Ping,PutModel,PutModelAck,GetModel,GetModelAck,DeleteModel,DeleteModelAck,GetList,GetListAck<br></blockquote>
## [&#9664;](#-message)&nbsp;[&#8984;](#table-of-contents)&nbsp;[&#9654;](#-procedure) &nbsp;Model
&nbsp;<b><i>model tests applied:</i></b>
```javascript
this.log('Tests Muted: ' + wasMuted);
return wasMuted > 0;
```
<blockquote><strong>log: </strong>Tests Muted: 25<br>returns <strong>true</strong> as expected
</blockquote>
## [&#9664;](#-model)&nbsp;[&#8984;](#table-of-contents)&nbsp;[&#9654;](#-request) &nbsp;Procedure
#### Procedure Class
The _Procedure_ class manages a set of _Command_ objects.  It provides a pattern for handling asynchronous and synchronous command execution.    

_Command_ objects create and manage the _Procedure_ object.    

#### CONSTRUCTOR
&nbsp;<b><i>objects created should be an instance of Procedure:</i></b>
```javascript
return new Procedure() instanceof Procedure;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
&nbsp;<b><i>should make sure new operator used:</i></b>
```javascript
Procedure(); // jshint ignore:line
```
<blockquote><strong>Error: new operator required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>should make sure argument properties are valid:</i></b>
```javascript
new Procedure({yo: 'whatup'});
```
<blockquote><strong>Error: error creating Procedure: invalid property: yo</strong> thrown as expected
</blockquote>
#### PROPERTIES
#### tasks
Tasks is an array of objects that represent each step of the procedure.  See TASKS section below for each property of this unnamed object (task array element).    

&nbsp;<b><i>tasks can be falsy if no tasks defined otherwise it has to be an array:</i></b>
```javascript
new Procedure({tasks: true});
```
<blockquote><strong>Error: error creating Procedure: tasks is not an array</strong> thrown as expected
</blockquote>
&nbsp;<b><i>the parameters must be valid for the object in each element of the array:</i></b>
```javascript
new Procedure({tasks: [
  {clean: 'room'}
]});
```
<blockquote><strong>Error: error creating Procedure: invalid task[0] property: clean</strong> thrown as expected
</blockquote>
#### tasksNeeded
Total tasks that will execute (does not include skipped tasks).    

_See Integration Tests for usage_    

#### tasksCompleted
Number of tasks completed and started (does not include skipped tasks)    

_See Integration Tests for usage_    

#### TASKS
Each element of the array tasks is an object with the following properties:    

#### label
optional label for this task task element    

&nbsp;<b><i>if used it must be a string:</i></b>
```javascript
new Procedure({tasks: [
  {label: true}
]});
```
<blockquote><strong>Error: error creating Procedure: task[0].label must be string</strong> thrown as expected
</blockquote>
#### command
Command to execute for this task    

&nbsp;<b><i>if used it must be a string:</i></b>
```javascript
new Procedure({tasks: [
  {command: true}
]});
```
<blockquote><strong>Error: error creating Procedure: task[0].command must be a Command object</strong> thrown as expected
</blockquote>
#### requires
Establish other tasks that must be complete before this task is executed.  Pass as array of or single element. Can be string(for label label) or number(for array index).  Use -1 for previous task, null for no dependencies    

&nbsp;<b><i>test it:</i></b>
```javascript
this.shouldThrowError(Error('invalid type for requires in task[0]'), function () {
  new Procedure({tasks: [
    {requires: new Date() }
  ]});
});
// if number supplied it is index in array
this.shouldThrowError(Error('missing task #1 for requires in task[0]'), function () {
  new Procedure({tasks: [
    {command: new Procedure({}), requires: 1 }
  ]});
});
this.shouldThrowError(Error('task #-2 invalid requires in task[0]'), function () {
  new Procedure({tasks: [
    {command: new Procedure({}), requires: -2 }
  ]});
});
// requires defaults to -1 which means the previous element in the array so essentially the default
// is sequential processing.  Set to null for no dependencies which makes it asynchronous -1 means
// previous element is ignored for first index and is the default
var proc = new Procedure({tasks: [
  {command: new Command({})}
]});
this.shouldBeTrue(proc.tasks[0].requires == -1);
```
#### METHODS
#### getObjectStateErrors
&nbsp;<b><i>should return array of validation errors:</i></b>
```javascript
if (!new Procedure().getObjectStateErrors()) return 'falsy';
```
<blockquote>returns <strong>falsy</strong> as expected
</blockquote>
#### INTEGRATION
&nbsp;<b><i>synchronous sequential tasks are the default when tasks has no requires property:</i></b>
```javascript
var cmd = new Command({name: 'cmdProcedure', type: 'Procedure', contents: new Procedure({tasks: [
  {
    command: new Command({
      type: 'Function',
      contents: function () {
        var self = this;
        setTimeout(function () {
          self._parentProcedure.bucket += '1';
          self.complete();
        }, 250); // delayed to test that order is maintained
      }
    })
  },
  {
    command: new Command({
      type: 'Function',
      contents: function () {
        this._parentProcedure.bucket += '2';
        this.complete();
      }
    })
  },
  function () { // shorthand version of command function ...
    this._parentProcedure.bucket += '3';
    this.complete();
  }
]})});
cmd.onEvent('*', function (event) {
  if (event == 'Completed') callback(cmd.bucket);
});
cmd.bucket = 'abc';
cmd.execute();
```
<blockquote>returns <strong>abc123</strong> as expected
</blockquote>
&nbsp;<b><i>async tasks are designated when requires is set to null:</i></b>
```javascript
var cmd = new Command({name: 'cmdProcedure', type: 'Procedure', contents: new Procedure({tasks: [
  {
    command: new Command({
      type: 'Function',
      contents: function () {
        var self = this;
        setTimeout(function () {
          self._parentProcedure.bucket += ' mo';
          self.complete();
        }, 250); // This will be done last
      }
    })
  },
  {
    requires: null, // no wait to run this
    command: new Command({
      type: 'Function',
      contents: function () {
        this._parentProcedure.bucket += ' miney';
        this.complete();
      }
    })
  }
]})});
cmd.onEvent('*', function (event) {
  if (event == 'Completed') callback(cmd.bucket);
});
cmd.bucket = 'eenie meenie';
cmd.execute();
```
<blockquote>returns <strong>eenie meenie miney mo</strong> as expected
</blockquote>
&nbsp;<b><i>this example shows multiple dependencies:</i></b>
```javascript
var cmd = new Command({name: 'cmdProcedure', type: 'Procedure', contents: new Procedure({tasks: [
  {
    command: new Command({
      type: 'Function',
      contents: function () {
        var self = this;
        setTimeout(function () {
          self._parentProcedure.bucket += ' rock';
          self.complete();
        }, 300);
      }
    })
  },
  {
    requires: null, // no wait to run this
    label: 'sex',
    command: new Command({
      type: 'Function',
      contents: function () {
        var self = this;
        setTimeout(function () {
          self._parentProcedure.bucket += ' sex';
          self.complete();
        }, 200);
      }
    })
  },
  {
    requires: null, // no wait to run this
    label: 'drugs',
    command: new Command({
      type: 'Function',
      contents: function () {
        var self = this;
        setTimeout(function () {
          self._parentProcedure.bucket += ' drugs';
          self.complete();
        }, 100);
      }
    })
  },
  {
    requires: ['sex', 'drugs', 0], // need these labels and array index 0
    command: new Command({
      type: 'Function',
      contents: function () {
        this._parentProcedure.bucket += ' & roll';
        this.complete();
      }
    })
  }
]})});
cmd.onEvent('*', function (event) {
  if (event == 'Completed') callback(cmd.bucket);
});
cmd.bucket = 'todo:';
cmd.execute();
```
<blockquote>returns <strong>todo: drugs sex rock & roll</strong> as expected
</blockquote>
## [&#9664;](#-procedure)&nbsp;[&#8984;](#table-of-contents)&nbsp;[&#9654;](#-store) &nbsp;Request
Requests handle the Request / Response design pattern.  They are used by the Interface class to communicate with the Application Model    

#### CONSTRUCTOR
&nbsp;<b><i>objects created should be an instance of Request:</i></b>
```javascript
return new Request('Null') instanceof Request;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
&nbsp;<b><i>should make sure new operator used:</i></b>
```javascript
Request('Null'); // jshint ignore:line
```
<blockquote><strong>Error: new operator required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>request type must be specified:</i></b>
```javascript
new Request();
```
<blockquote><strong>Error: Request type required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>simple string parameter creates request of named type:</i></b>
```javascript
return new Request('example').type;
```
<blockquote>returns <strong>example</strong> as expected
</blockquote>
&nbsp;<b><i>type can be specified when object passed:</i></b>
```javascript
return new Request({type: 'example'}).type;
```
<blockquote>returns <strong>example</strong> as expected
</blockquote>
&nbsp;<b><i>Command type requests expect contents to contain a command object:</i></b>
```javascript
return new Request({type: 'Command'});
```
<blockquote><strong>Error: command object required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>correct version:</i></b>
```javascript
return new Request({type: 'Command', command: new Command()});
```
<blockquote>returns <strong>Command Request: Stub Command: (unnamed)</strong> as expected
</blockquote>
#### METHODS
#### toString()
&nbsp;<b><i>should return a description of the Request:</i></b>
```javascript
return new Request('Null').toString();
```
<blockquote>returns <strong>Null Request</strong> as expected
</blockquote>
## [&#9664;](#-request)&nbsp;[&#8984;](#table-of-contents)&nbsp;[&#9654;](#-transport) &nbsp;Store
The store class is used for object persistence.    

#### CONSTRUCTOR
&nbsp;<b><i>objects created should be an instance of Store:</i></b>
```javascript
return new SurrogateStore() instanceof Store;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
&nbsp;<b><i>should make sure new operator used:</i></b>
```javascript
SurrogateStore(); // jshint ignore:line
```
<blockquote><strong>Error: new operator required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>should make sure properties are valid:</i></b>
```javascript
new SurrogateStore({food: 'twinkies'});
```
<blockquote><strong>Error: error creating Store: invalid property: food</strong> thrown as expected
</blockquote>
#### PROPERTIES
#### name
&nbsp;<b><i>name of store can be set in constructor:</i></b>
```javascript
return new SurrogateStore({name: 'punchedCards'}).name;
```
<blockquote>returns <strong>punchedCards</strong> as expected
</blockquote>
#### storeType
storeType defaults to Store Class Name but can be set to suite the app architecture.    

&nbsp;<b><i>storeType can be set in constructor:</i></b>
```javascript
return new SurrogateStore({storeType: 'legacyStorage'}).storeType;
```
<blockquote>returns <strong>legacyStorage</strong> as expected
</blockquote>
#### METHODS
&nbsp;<b><i>getServices() returns an object with interface for the Store.:</i></b>
```javascript
this.log(JSON.stringify(services));
this.shouldBeTrue(services instanceof Object);
this.shouldBeTrue(typeof services['isReady'] == 'boolean'); // don't use until
this.shouldBeTrue(typeof services['canGetModel'] == 'boolean'); // define all allowed methods...
this.shouldBeTrue(typeof services['canPutModel'] == 'boolean');
this.shouldBeTrue(typeof services['canDeleteModel'] == 'boolean');
this.shouldBeTrue(typeof services['canGetList'] == 'boolean');
```
<blockquote><strong>log: </strong>{"isReady":false,"canGetModel":false,"canPutModel":false,"canDeleteModel":false,"canGetList":false}<br></blockquote>
#### toString()
&nbsp;<b><i>should return a description of the Store:</i></b>
```javascript
var cStore = new SurrogateStore();
this.log(cStore.toString());
cStore.name = '7-Eleven';
cStore.storeType = 'ConvenienceStore';
this.log(cStore.toString());
return cStore.toString();
```
<blockquote><strong>log: </strong>ConvenienceStore: 7-Eleven<br><strong>log: </strong>a Store<br>returns <strong>ConvenienceStore: 7-Eleven</strong> as expected
</blockquote>
#### onConnect()
&nbsp;<b><i>must pass url string:</i></b>
```javascript
new SurrogateStore().onConnect();
```
<blockquote><strong>Error: argument must a url string</strong> thrown as expected
</blockquote>
&nbsp;<b><i>must pass callback function:</i></b>
```javascript
new SurrogateStore().onConnect("");
```
<blockquote><strong>Error: argument must a callback</strong> thrown as expected
</blockquote>
see integration test for Store    

#### getModel()
&nbsp;<b><i>getModel() is not implemented for virtual class:</i></b>
```javascript
new SurrogateStore().getModel();
```
<blockquote><strong>Error: Store does not provide getModel</strong> thrown as expected
</blockquote>
#### putModel(model)
&nbsp;<b><i>putModel() is not implemented for virtual class:</i></b>
```javascript
new SurrogateStore().putModel();
```
<blockquote><strong>Error: Store does not provide putModel</strong> thrown as expected
</blockquote>
#### deleteModel(model)
&nbsp;<b><i>deleteModel() is not implemented for virtual class:</i></b>
```javascript
new SurrogateStore().deleteModel();
```
<blockquote><strong>Error: Store does not provide deleteModel</strong> thrown as expected
</blockquote>
#### getList(model, filter, order)
This method will clear and populate the list with collection from store.  The **filter** property can be used to query the store.  The **order** property can specify the sort order of the list.  _See integration test for more info._    

#### Store Integration
#### CRUD (Create Read Update Delete)
&nbsp;<b><i>Exercise all store function for one store.:</i></b>
```javascript
var self = this;
spec.integrationStore = new SurrogateStore();
var storeBeingTested = spec.integrationStore.name + ' ' + spec.integrationStore.storeType;
self.log(storeBeingTested);
// If store is not ready then get out...
if (!spec.integrationStore.getServices().isReady) {
  self.log('Store is not ready.');
  callback(true);
  return;
}
// setup stooge class
self.Stooge = function (args) {
  Model.call(this, args);
  this.modelType = "_tempTest_Stooge";
  this.attributes.push(new Attribute('name'));
};
self.Stooge.prototype = inheritPrototype(Model.prototype);
// create initial stooges
self.moe = new self.Stooge();
self.moe.set('name', 'Moe');
self.larry = new self.Stooge();
self.larry.set('name', 'Larry');
self.shemp = new self.Stooge();
self.shemp.set('name', 'Shemp');
// IDs after stored will be here
self.stoogeIDsStored = [];
self.stoogesRetrieved = [];
self.oldStoogesFound = 0;
self.oldStoogesKilled = 0;
// Make sure store starts in known state.  Stores such as mongoStore will retain test values.
// So... use getList to get all stooges then delete them from the Store
var useListToCleanStart = spec.integrationStore.getServices().canGetList;
if (useListToCleanStart) {
  var list = new List(new self.Stooge());
  try {
    self.killhim = new self.Stooge();
    spec.integrationStore.getList(list, [], function (list, error) {
      if (typeof error != 'undefined') {
        callback(error);
        return;
      }
      if (list._items.length < 1)
        storeStooges();
      else
        self.oldStoogesFound = list._items.length;
      for (var i = 0; i < list._items.length; i++) {
        self.killhim.set('id', list._items[i][0]);
        /* jshint ignore:start */
        spec.integrationStore.deleteModel(self.killhim, function (model, error) {
          if (++self.oldStoogesKilled >= self.oldStoogesFound) {
            storeStooges();
          }
        })
        /* jshint ignore:end */
      }
    });
  }
  catch (err) {
    callback(err);
  }
} else {
  storeStooges();
}
// Callback to store new stooges
function storeStooges() {
  self.log(self.oldStoogesFound);
  self.log(self.oldStoogesKilled);
  spec.integrationStore.putModel(self.moe, stoogeStored);
  spec.integrationStore.putModel(self.larry, stoogeStored);
  spec.integrationStore.putModel(self.shemp, stoogeStored);
}
// callback after storing stooges
function stoogeStored(model, error) {
  if (typeof error != 'undefined') {
    callback(error);
    return;
  }
  try {
    self.stoogeIDsStored.push(model.get('id'));
    if (self.stoogeIDsStored.length == 3) {
      self.shouldBeTrue(true,'here');
      // Now that first 3 stooges are stored lets retrieve and verify
      var actors = [];
      for (var i = 0; i < 3; i++) {
        actors.push(new self.Stooge());
        actors[i].set('id', self.stoogeIDsStored[i]);
        spec.integrationStore.getModel(actors[i], stoogeRetrieved);
      }
    }
  }
  catch (err) {
    callback(err);
  }
}
// callback after retrieving stored stooges
function stoogeRetrieved(model, error) {
  if (typeof error != 'undefined') {
    callback(error);
    return;
  }
  self.stoogesRetrieved.push(model);
  if (self.stoogesRetrieved.length == 3) {
    self.shouldBeTrue(true,'here');
    // Now we have stored and retrieved (via IDs into new objects).  So verify the stooges made it
    self.shouldBeTrue(self.stoogesRetrieved[0] !== self.moe && // Make sure not a reference but a copy
    self.stoogesRetrieved[0] !== self.larry && self.stoogesRetrieved[0] !== self.shemp,'copy');
    var s = []; // get list of names to see if all stooges made it
    for (var i = 0; i < 3; i++) s.push(self.stoogesRetrieved[i].get('name'));
    self.log(s);
    self.shouldBeTrue(contains(s, 'Moe') && contains(s, 'Larry') && contains(s, 'Shemp'));
    // Replace Shemp with Curly
    var didPutCurly = false;
    for (i = 0; i < 3; i++) {
      if (self.stoogesRetrieved[i].get('name') == 'Shemp') {
        didPutCurly = true;
        self.stoogesRetrieved[i].set('name', 'Curly');
        try {
          spec.integrationStore.putModel(self.stoogesRetrieved[i], stoogeChanged);
        }
        catch (err) {
          callback(err);
        }
      }
    }
    if (!didPutCurly) {
      callback(Error("Can't find Shemp!"));
    }
  }
}
// callback after storing changed stooge
function stoogeChanged(model, error) {
  if (typeof error != 'undefined') {
    callback(error);
    return;
  }
  self.shouldBeTrue(model.get('name') == 'Curly','Curly');
  var curly = new self.Stooge();
  curly.set('id', model.get('id'));
  try {
    spec.integrationStore.getModel(curly, storeChangedShempToCurly);
  }
  catch (err) {
    callback(err);
  }
}
// callback after retrieving changed stooge
function storeChangedShempToCurly(model, error) {
  if (typeof error != 'undefined') {
    callback(error);
    return;
  }
  self.shouldBeTrue(model.get('name') == 'Curly','Curly');
  // Now test delete
  self.deletedModelId = model.get('id'); // Remember this
  spec.integrationStore.deleteModel(model, stoogeDeleted);
}
// callback when Curly is deleted
function stoogeDeleted(model, error) {
  if (typeof error != 'undefined') {
    callback(error);
    return;
  }
  // model parameter is what was deleted
  self.shouldBeTrue(undefined === model.get('id')); // ID removed
  self.shouldBeTrue(model.get('name') == 'Curly'); // the rest remains
  // Is it really dead?
  var curly = new self.Stooge();
  curly.set('id', self.deletedModelId);
  spec.integrationStore.getModel(curly, hesDeadJim);
}
// callback after lookup of dead stooge
function hesDeadJim(model, error) {
  if (typeof error != 'undefined') {
    if ((error != 'Error: id not found in store') && (error != 'Error: model not found in store')) {
      callback(error);
      return;
    }
  } else {
    callback(Error('no error deleting stooge when expected'));
    return;
  }
  // Skip List test if subclass can't do
  if (!spec.integrationStore.getServices().canGetList) {
    callback(true);
  } else {
    // Now create a list from the stooge store
    var list = new List(new self.Stooge());
    try {
      spec.integrationStore.getList(list, {}, {name:1}, listReady);
    }
    catch (err) {
      callback(err);
    }
  }
}
// callback after list created from store
function listReady(list, error) {
//          list.sort({name:1});
  if (typeof error != 'undefined') {
    callback(error);
    return;
  }
  self.shouldBeTrue(list instanceof List,'is list');
  self.shouldBeTrue(list.length() == 2,'is 2');
  list.moveFirst();
  self.shouldBeTrue(list.get('name') == 'Larry','larry');
  list.moveNext();
  self.shouldBeTrue(list.get('name') == 'Moe','moe');
  callback(true);
}
```
<blockquote><strong>log: </strong>Store is not ready.<br><strong>log: </strong>a Store Store<br>returns <strong>true</strong> as expected
</blockquote>
## [&#9664;](#-store)&nbsp;[&#8984;](#table-of-contents)&nbsp;[&#9654;](#-application) &nbsp;Transport
Handle message passing between host and UI.    

TODO: run these tests in node-make-spec-md with io defined    

Read the source until then...    

https://github.com/tgi-io/tgi-core/blob/master/lib/core/tgi-core-transport.spec.js    


## [&#9664;](#-transport)&nbsp;[&#8984;](#table-of-contents)&nbsp;[&#9654;](#-log) &nbsp;Application
#### CONSTRUCTOR
&nbsp;<b><i>objects created should be an instance of Application:</i></b>
```javascript
return new Application() instanceof Application;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
&nbsp;<b><i>model tests applied:</i></b>
```javascript
this.log('Tests Muted: ' + wasMuted);
return wasMuted > 0;
```
<blockquote><strong>log: </strong>Tests Muted: 25<br>returns <strong>true</strong> as expected
</blockquote>
#### ATTRIBUTES
Application extends model and inherits the attributes property.  All Application objects have the following attributes:    

&nbsp;<b><i>following attributes are defined::</i></b>
```javascript
var presentation = new Application(); // default attributes and values
this.shouldBeTrue(presentation.get('name') === 'newApp');
this.shouldBeTrue(presentation.get('brand') === 'NEW APP');
```
#### METHODS
#### setInterface(interface)
Setting the interface for the application determines the primary method of user interaction.    

&nbsp;<b><i>must supply Interface object:</i></b>
```javascript
new Application().setInterface();
```
<blockquote><strong>Error: instance of Interface a required parameter</strong> thrown as expected
</blockquote>
#### getInterface()
returns primary user interface for application    

&nbsp;<b><i>default is undefined:</i></b>
```javascript
return new Application().getInterface() === undefined;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
&nbsp;<b><i>returns value set by set Interface:</i></b>
```javascript
var myInterface = new Interface();
var myApplication = new Application();
myApplication.setInterface(myInterface);
return (myApplication.getInterface() === myInterface);
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
#### setPresentation(presentation)
Setting the presentation for the application determines the primary commands available to the user.    

&nbsp;<b><i>must supply Presentation object:</i></b>
```javascript
new Application().setPresentation();
```
<blockquote><strong>Error: instance of Presentation a required parameter</strong> thrown as expected
</blockquote>
#### getPresentation()
returns primary user presentation for application    

&nbsp;<b><i>default is undefined:</i></b>
```javascript
return new Application().getPresentation() === undefined;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
&nbsp;<b><i>returns value set by set Presentation:</i></b>
```javascript
var myPresentation = new Presentation();
var myApplication = new Application();
myApplication.setPresentation(myPresentation);
return (myApplication.getPresentation() === myPresentation);
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
#### start()
The start method executes the application.    

&nbsp;<b><i>must set interface before starting:</i></b>
```javascript
new Application().start();
```
<blockquote><strong>Error: error starting application: interface not set</strong> thrown as expected
</blockquote>
&nbsp;<b><i>callback parameter required:</i></b>
```javascript
var app = new Application();
app.setInterface(new Interface());
app.start();
```
<blockquote><strong>Error: callBack required</strong> thrown as expected
</blockquote>
#### dispatch()
The dispatch method will accept a request and act on it or pass it to the app.    

&nbsp;<b><i>must pass a Request object:</i></b>
```javascript
new Application().dispatch();
```
<blockquote><strong>Error: Request required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>send command without callback when no response needed:</i></b>
```javascript
new Application().dispatch(new Request({type: 'Command', command: new Command()}));
```
&nbsp;<b><i>optional second parameter is the response callback:</i></b>
```javascript
new Application().dispatch(new Request({type: 'Command', command: new Command()}), true);
```
<blockquote><strong>Error: response callback is not a function</strong> thrown as expected
</blockquote>
#### yesno(prompt, callBack)
Query user with a yes no question.    

&nbsp;<b><i>must set interface before invoking:</i></b>
```javascript
new Application().yesno();
```
<blockquote><strong>Error: interface not set</strong> thrown as expected
</blockquote>
&nbsp;<b><i>must provide the text question param:</i></b>
```javascript
var myApplication = new Application();
myApplication.setInterface(new Interface());
myApplication.yesno();
```
<blockquote><strong>Error: prompt required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>must provide callback param:</i></b>
```javascript
var myApplication = new Application();
myApplication.setInterface(new Interface());
myApplication.yesno('Who moved my cheese?');
```
<blockquote><strong>Error: callBack required</strong> thrown as expected
</blockquote>
#### ok(prompt, callBack)
Pause before proceeding    

&nbsp;<b><i>must set interface before invoking:</i></b>
```javascript
new Application().ok();
```
<blockquote><strong>Error: interface not set</strong> thrown as expected
</blockquote>
&nbsp;<b><i>must provide the text prompt param:</i></b>
```javascript
var myApplication = new Application();
myApplication.setInterface(new Interface());
myApplication.ok();
```
<blockquote><strong>Error: prompt required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>must provide callback param:</i></b>
```javascript
var myApplication = new Application();
myApplication.setInterface(new Interface());
myApplication.ok('You are about to enter the twilight zone.');
```
<blockquote><strong>Error: callBack required</strong> thrown as expected
</blockquote>
#### ask(prompt, attribute, callBack)
Simple single item prompt.    

&nbsp;<b><i>must set interface before invoking:</i></b>
```javascript
new Application().ask();
```
<blockquote><strong>Error: interface not set</strong> thrown as expected
</blockquote>
&nbsp;<b><i>must provide the text question param:</i></b>
```javascript
var myApplication = new Application();
myApplication.setInterface(new Interface());
myApplication.ask();
```
<blockquote><strong>Error: prompt required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>must supply attribute:</i></b>
```javascript
var myApplication = new Application();
myApplication.setInterface(new Interface());
myApplication.ask('What it do');
// myApplication.prompt('Name Please:',new Attribute());
```
<blockquote><strong>Error: instance of Attribute a required parameter</strong> thrown as expected
</blockquote>
&nbsp;<b><i>must provide callback param:</i></b>
```javascript
var myApplication = new Application();
myApplication.setInterface(new Interface());
myApplication.ask('Please enter your name', new Attribute({name: 'Name'}));
```
<blockquote><strong>Error: callBack required</strong> thrown as expected
</blockquote>
#### choose
prompt to choose an item    

&nbsp;<b><i>must set interface before invoking:</i></b>
```javascript
new Application().choose();
```
<blockquote><strong>Error: interface not set</strong> thrown as expected
</blockquote>
&nbsp;<b><i>must provide text prompt first:</i></b>
```javascript
var myApplication = new Application();
myApplication.setInterface(new Interface());
myApplication.choose();
```
<blockquote><strong>Error: prompt required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>must supply array of choices:</i></b>
```javascript
var myApplication = new Application();
myApplication.setInterface(new Interface());
this.shouldThrowError(Error('choices array required'), function () {
  myApplication.choose('What it do');
});
this.shouldThrowError(Error('choices array required'), function () {
  myApplication.choose('this will not', 'work');
});
this.shouldThrowError(Error('choices array empty'), function () {
  myApplication.choose('empty array?', []);
});
```
&nbsp;<b><i>must provide callback param:</i></b>
```javascript
var myApplication = new Application();
myApplication.setInterface(new Interface());
myApplication.choose('choose wisely', ['rock', 'paper', 'scissors']);
```
<blockquote><strong>Error: callBack required</strong> thrown as expected
</blockquote>
#### Application Integration
&nbsp;<b><i>little app with command execution mocking:</i></b>
```javascript
// todo delamify this
// Send 4 mocks and make sure we get 4 callback calls
var self = this;
self.callbackCount = 0;
var app = new Application();
var testInterface = new Interface();
var testPresentation = new Presentation();
app.setInterface(testInterface);
app.setPresentation(testPresentation);
app.start(function (request) {
  if (request.type == 'mock count')
    self.callbackCount++;
  if (self.callbackCount > 3)
    callback(true);
});
var cmds = [];
var i;
for (i = 0; i < 4; i++) {
  cmds.push(new Request('mock count'));
}
testInterface.mockRequest(cmds);
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
## [&#9664;](#-application)&nbsp;[&#8984;](#table-of-contents)&nbsp;[&#9654;](#-presentation) &nbsp;Log
#### Log Model
Multi purpose log model.    

#### CONSTRUCTOR
&nbsp;<b><i>objects created should be an instance of Workspace:</i></b>
```javascript
return new Log() instanceof Log;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
#### Model tests are applied
&nbsp;<b><i>model tests applied:</i></b>
```javascript
this.log('Tests Muted: ' + wasMuted);
return wasMuted > 0;
```
<blockquote><strong>log: </strong>Tests Muted: 25<br>returns <strong>true</strong> as expected
</blockquote>
#### ATTRIBUTES
&nbsp;<b><i>following attributes are defined::</i></b>
```javascript
var log = new Log('what up'); // default attributes and values
this.shouldBeTrue(log.get('id') !== undefined);
this.shouldBeTrue(log.get('dateLogged') instanceof Date);
this.log(log.get('dateLogged'));
this.shouldBeTrue(log.get('logType') == 'Text');
this.shouldBeTrue(log.get('importance') == 'Info');
this.shouldBeTrue(log.get('contents') == 'what up');
```
<blockquote><strong>log: </strong>Sat Jan 03 2015 22:24:32 GMT-0500 (EST)<br></blockquote>
#### LOG TYPES
&nbsp;<b><i>must be valid:</i></b>
```javascript
this.log('T.getLogTypes()');
new Log({logType: 'wood'}); // default attributes and values
```
<blockquote><strong>log: </strong>T.getLogTypes()<br><strong>Error: Unknown log type: wood</strong> thrown as expected
</blockquote>
&nbsp;<b><i>Text simple text message:</i></b>
```javascript
return new Log('sup');
```
<blockquote>returns <strong>Info: sup</strong> as expected
</blockquote>
&nbsp;<b><i>Delta logged Delta (see in Core):</i></b>
```javascript
var delta = new Delta(new Attribute.ModelID(new Model()));
return new Log({logType: 'Delta', contents: delta}).toString();
```
<blockquote>returns <strong>Info: (delta)</strong> as expected
</blockquote>
## [&#9664;](#-log)&nbsp;[&#8984;](#table-of-contents)&nbsp;[&#9654;](#-session) &nbsp;Presentation
#### Presentation Model
The Presentation Model represents the way in which a model is to be presented to the user.  The presentation is meant to be a "hint" to a Interface object.  The specific Interface object will represent the model data according to the Presentation object.    

#### CONSTRUCTOR
&nbsp;<b><i>objects created should be an instance of Presentation:</i></b>
```javascript
return new Presentation() instanceof Presentation;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
#### Model tests are applied
&nbsp;<b><i>model tests applied:</i></b>
```javascript
this.log('Tests Muted: ' + wasMuted);
return wasMuted > 0;
```
<blockquote><strong>log: </strong>Tests Muted: 25<br>returns <strong>true</strong> as expected
</blockquote>
#### PROPERTIES
#### model
This is a model instance for the presentation instance.    

#### validationErrors
&nbsp;<b><i>Array of errors:</i></b>
```javascript
this.shouldBeTrue(new Presentation().validationErrors instanceof Array);
this.shouldBeTrue(new Presentation().validationErrors.length === 0);
```
#### validationMessage
&nbsp;<b><i>string description of error(s):</i></b>
```javascript
return new Presentation().validationMessage;
```
#### ATTRIBUTES
Presentation extends model and inherits the attributes property.  All Presentation objects have the following attributes:    

&nbsp;<b><i>following attributes are defined::</i></b>
```javascript
var presentation = new Presentation(); // default attributes and values
this.shouldBeTrue(presentation.get('id') === null);
this.shouldBeTrue(presentation.get('name') === null);
this.shouldBeTrue(presentation.get('modelName') === null);
this.shouldBeTrue(presentation.get('contents') instanceof Array);
```
#### METHODS
#### modelConstructor
This is a reference to the constructor function to create a new model    

#### validate
check valid object state then extend to presentation contents    

&nbsp;<b><i>callback is required -- see integration:</i></b>
```javascript
new Presentation().validate();
```
<blockquote><strong>Error: callback is required</strong> thrown as expected
</blockquote>
#### CONTENTS
The contents attributes provides the structure for the presentation.    

&nbsp;<b><i>content must be an array:</i></b>
```javascript
var pres = new Presentation();
pres.set('contents', true);
return pres.getObjectStateErrors();
```
<blockquote>returns <strong>contents must be Array</strong> as expected
</blockquote>
&nbsp;<b><i>array elements must be Command , Attribute or String:</i></b>
```javascript
var pres = new Presentation();
// strings with prefix # are heading, a dash - by itself is for a visual separator
pres.set('contents', ['#heading', new Command(), new Attribute({name: 'meh'})]);
this.shouldBeTrue(pres.getObjectStateErrors().length === 0);
pres.set('contents', [new Command(), new Attribute({name: 'meh'}), true]);
return pres.getObjectStateErrors();
```
<blockquote>returns <strong>contents elements must be Command, Attribute or string</strong> as expected
</blockquote>
#### INTEGRATION
&nbsp;<b><i>validation usage demonstrated:</i></b>
```javascript
var attribute = new Attribute({name: 'test'});
var presentation = new Presentation(); // default attributes and values
presentation.set('contents', [
  attribute
]);
attribute.setError('test', 'test error');
presentation.validate(function () {
  callback(presentation.validationMessage);
});
```
<blockquote>returns <strong>contents has validation errors</strong> as expected
</blockquote>
## [&#9664;](#-presentation)&nbsp;[&#8984;](#table-of-contents)&nbsp;[&#9654;](#-user) &nbsp;Session
#### Session Model
The Session Model represents the Session logged into the system. The library uses this for system access, logging and other functions.    

#### CONSTRUCTOR
&nbsp;<b><i>objects created should be an instance of Session:</i></b>
```javascript
return new Session() instanceof Session;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
#### Model tests are applied
&nbsp;<b><i>model tests applied:</i></b>
```javascript
this.log('Tests Muted: ' + wasMuted);
return wasMuted > 0;
```
<blockquote><strong>log: </strong>Tests Muted: 25<br>returns <strong>true</strong> as expected
</blockquote>
#### ATTRIBUTES
&nbsp;<b><i>following attributes are defined::</i></b>
```javascript
var session = new Session(); // default attributes and values
this.shouldBeTrue(session.get('id') === null);
this.shouldBeTrue(session.get('userID') instanceof Attribute.ModelID);
this.shouldBeTrue(session.get('userID').modelType == 'User');
this.shouldBeTrue(session.get('dateStarted') instanceof Date);
this.shouldBeTrue(session.get('passCode') === null);
this.shouldBeTrue(session.get('ipAddress') === null);
this.shouldBeTrue(session.get('active') === false);
```
#### METHODS
#### startSession()
This method will create a new session record for a user.    

&nbsp;<b><i>parameters are store, user, password, IP and callback:</i></b>
```javascript
this.shouldThrowError(Error('store required'), function () {
  new Session().startSession();
});
this.shouldThrowError(Error('userName required'), function () {
  new Session().startSession(new Store());
});
this.shouldThrowError(Error('password required'), function () {
  new Session().startSession(new Store(), 'blow');
});
this.shouldThrowError(Error('ip required'), function () {
  new Session().startSession(new Store(), 'blow', 'me');
});
this.shouldThrowError(Error('callBack required'), function () {
  new Session().startSession(new Store(), 'blow', 'me', 'ipman');
});
```
#### resumeSession()
This method will resume an existing session.    

&nbsp;<b><i>parameters are store, IP, passcode and callback:</i></b>
```javascript
this.shouldThrowError(Error('store required'), function () {
  new Session().resumeSession();
});
this.shouldThrowError(Error('ip required'), function () {
  new Session().resumeSession(new Store());
});
this.shouldThrowError(Error('passCode required'), function () {
  new Session().resumeSession(new Store(), 'ipman');
});
this.shouldThrowError(Error('callBack required'), function () {
  new Session().resumeSession(new Store(), 'ipman', '123');
});
```
#### endSession()
Method to end session.    

&nbsp;<b><i>parameters are store and callback - session object should be in memory:</i></b>
```javascript
this.shouldThrowError(Error('store required'), function () {
  new Session().endSession();
});
this.shouldThrowError(Error('callBack required'), function () {
  new Session().endSession(new Store());
});
```
## [&#9664;](#-session)&nbsp;[&#8984;](#table-of-contents)&nbsp;[&#9654;](#-workspace) &nbsp;User
#### User Model
The User Model represents the user logged into the system. The library uses this for system access, logging and other functions.    

#### CONSTRUCTOR
&nbsp;<b><i>objects created should be an instance of User:</i></b>
```javascript
return new User() instanceof User;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
#### Model tests are applied
&nbsp;<b><i>model tests applied:</i></b>
```javascript
this.log('Tests Muted: ' + wasMuted);
return wasMuted > 0;
```
<blockquote><strong>log: </strong>Tests Muted: 25<br>returns <strong>true</strong> as expected
</blockquote>
#### ATTRIBUTES
&nbsp;<b><i>following attributes are defined::</i></b>
```javascript
var user = new User(); // default attributes and values
this.shouldBeTrue(user.get('id') === null);
this.shouldBeTrue(user.get('name') === null);
this.shouldBeTrue(user.get('active') === false);
this.shouldBeTrue(user.get('password') === null);
this.shouldBeTrue(user.get('firstName') === null);
this.shouldBeTrue(user.get('lastName') === null);
this.shouldBeTrue(user.get('email') === null);
```
## [&#9664;](#-user)&nbsp;[&#8984;](#table-of-contents)&nbsp;[&#9654;](#-memorystore) &nbsp;Workspace
#### Workspace Model
A workspace is a collection of active deltas for a user.  The GUI could represent that as opentabs for instance.  Each tab a model view.  The deltas represent the change in model state    

#### CONSTRUCTOR
&nbsp;<b><i>objects created should be an instance of Workspace:</i></b>
```javascript
return new Workspace() instanceof Workspace;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
#### Model tests are applied
&nbsp;<b><i>model tests applied:</i></b>
```javascript
this.log('Tests Muted: ' + wasMuted);
return wasMuted > 0;
```
<blockquote><strong>log: </strong>Tests Muted: 25<br>returns <strong>true</strong> as expected
</blockquote>
#### ATTRIBUTES
&nbsp;<b><i>following attributes are defined::</i></b>
```javascript
var user = new Workspace(); // default attributes and values
this.shouldBeTrue(user.get('id') !== undefined);
this.shouldBeTrue(user.get('user') instanceof Attribute.ModelID);
this.shouldBeTrue(user.get('user').modelType == 'User');
this.shouldBeTrue(typeof user.get('deltas') == 'object');
```
#### METHODS
loadUserWorkspace(user, callBack)    

sync    

#### INTEGRATION

## [&#9664;](#-workspace)&nbsp;[&#8984;](#table-of-contents)&nbsp;[&#9654;](#-summary) &nbsp;MemoryStore
#### MemoryStore
The MemoryStore is a simple volatile store. It is the first test standard to define the spec for all Stores to follow.    

#### CONSTRUCTOR
#### Store Constructor tests are applied
&nbsp;<b><i>objects created should be an instance of Store:</i></b>
```javascript
return new SurrogateStore() instanceof Store;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
&nbsp;<b><i>should make sure new operator used:</i></b>
```javascript
SurrogateStore(); // jshint ignore:line
```
<blockquote><strong>Error: new operator required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>should make sure properties are valid:</i></b>
```javascript
new SurrogateStore({food: 'twinkies'});
```
<blockquote><strong>Error: error creating Store: invalid property: food</strong> thrown as expected
</blockquote>
&nbsp;<b><i>objects created should be an instance of MemoryStore:</i></b>
```javascript
return new MemoryStore() instanceof MemoryStore;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
#### Store tests are applied
#### PROPERTIES
#### name
&nbsp;<b><i>name of store can be set in constructor:</i></b>
```javascript
return new SurrogateStore({name: 'punchedCards'}).name;
```
<blockquote>returns <strong>punchedCards</strong> as expected
</blockquote>
#### storeType
storeType defaults to Store Class Name but can be set to suite the app architecture.    

&nbsp;<b><i>storeType can be set in constructor:</i></b>
```javascript
return new SurrogateStore({storeType: 'legacyStorage'}).storeType;
```
<blockquote>returns <strong>legacyStorage</strong> as expected
</blockquote>
#### METHODS
&nbsp;<b><i>getServices() returns an object with interface for the Store.:</i></b>
```javascript
this.log(JSON.stringify(services));
this.shouldBeTrue(services instanceof Object);
this.shouldBeTrue(typeof services['isReady'] == 'boolean'); // don't use until
this.shouldBeTrue(typeof services['canGetModel'] == 'boolean'); // define all allowed methods...
this.shouldBeTrue(typeof services['canPutModel'] == 'boolean');
this.shouldBeTrue(typeof services['canDeleteModel'] == 'boolean');
this.shouldBeTrue(typeof services['canGetList'] == 'boolean');
```
<blockquote><strong>log: </strong>{"isReady":true,"canGetModel":true,"canPutModel":true,"canDeleteModel":true,"canGetList":true}<br></blockquote>
#### toString()
&nbsp;<b><i>should return a description of the Store:</i></b>
```javascript
var cStore = new SurrogateStore();
this.log(cStore.toString());
cStore.name = '7-Eleven';
cStore.storeType = 'ConvenienceStore';
this.log(cStore.toString());
return cStore.toString();
```
<blockquote><strong>log: </strong>ConvenienceStore: 7-Eleven<br><strong>log: </strong>a MemoryStore<br>returns <strong>ConvenienceStore: 7-Eleven</strong> as expected
</blockquote>
#### onConnect()
&nbsp;<b><i>must pass url string:</i></b>
```javascript
new SurrogateStore().onConnect();
```
<blockquote><strong>Error: argument must a url string</strong> thrown as expected
</blockquote>
&nbsp;<b><i>must pass callback function:</i></b>
```javascript
new SurrogateStore().onConnect("");
```
<blockquote><strong>Error: argument must a callback</strong> thrown as expected
</blockquote>
&nbsp;<b><i>return store and undefined error upon successful connection to remote store.:</i></b>
```javascript
new SurrogateStore().onConnect('', function (store, err) {
  if (err) {
    callback(err);
  } else {
    callback(store instanceof Store);
  }
});
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
#### getModel()
&nbsp;<b><i>must pass valid model:</i></b>
```javascript
new SurrogateStore().getModel();
```
<blockquote><strong>Error: argument must be a Model</strong> thrown as expected
</blockquote>
&nbsp;<b><i>model must have no validation errors:</i></b>
```javascript
var m = new Model();
m.attributes = null;
new SurrogateStore().getModel(m);
```
<blockquote><strong>Error: model has validation errors</strong> thrown as expected
</blockquote>
&nbsp;<b><i>ID attribute must have truthy value:</i></b>
```javascript
new SurrogateStore().getModel(new Model());
```
<blockquote><strong>Error: ID not set</strong> thrown as expected
</blockquote>
&nbsp;<b><i>callback function required:</i></b>
```javascript
var m = new Model();
m.attributes[0].value = 1;
new SurrogateStore().getModel(m);
```
<blockquote><strong>Error: callBack required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>returns error when model not found:</i></b>
```javascript
var m = new Model();
m.attributes[0].value = 1;
new SurrogateStore().getModel(m, function (mod, err) {
  if (err) {
    callback(err);
  } else {
    callback(mod);
  }
});
```
<blockquote>returns <strong>Error: model not found in store</strong> as expected
</blockquote>
#### putModel(model)
&nbsp;<b><i>must pass valid model:</i></b>
```javascript
new SurrogateStore().putModel();
```
<blockquote><strong>Error: argument must be a Model</strong> thrown as expected
</blockquote>
&nbsp;<b><i>model must have no validation errors:</i></b>
```javascript
var m = new Model();
m.attributes = null;
new SurrogateStore().putModel(m);
```
<blockquote><strong>Error: model has validation errors</strong> thrown as expected
</blockquote>
&nbsp;<b><i>callback function required:</i></b>
```javascript
var m = new Model();
m.attributes[0].value = 1;
new SurrogateStore().putModel(m);
```
<blockquote><strong>Error: callBack required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>returns error when model not found:</i></b>
```javascript
var m = new Model();
m.attributes[0].value = 1;
new SurrogateStore().putModel(m, function (mod, err) {
  if (err) {
    callback(err);
  } else {
    callback(mod);
  }
});
```
<blockquote>returns <strong>Error: model not found in store</strong> as expected
</blockquote>
&nbsp;<b><i>creates new model when ID is not set:</i></b>
```javascript
// This works but pollutes store with crap
var m = new Model();
new SurrogateStore().putModel(m, function (mod, err) {
  if (err) {
    callback(err);
  } else {
    callback(mod.get('id') ? true : false);
  }
});
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>
#### deleteModel(model)
&nbsp;<b><i>must pass valid model:</i></b>
```javascript
new SurrogateStore().deleteModel();
```
<blockquote><strong>Error: argument must be a Model</strong> thrown as expected
</blockquote>
&nbsp;<b><i>model must have no validation errors:</i></b>
```javascript
var m = new Model();
m.attributes = null;
new SurrogateStore().deleteModel(m);
```
<blockquote><strong>Error: model has validation errors</strong> thrown as expected
</blockquote>
&nbsp;<b><i>callback function required:</i></b>
```javascript
var m = new Model();
m.attributes[0].value = 1;
new SurrogateStore().deleteModel(m);
```
<blockquote><strong>Error: callBack required</strong> thrown as expected
</blockquote>
&nbsp;<b><i>returns error when model not found:</i></b>
```javascript
var m = new Model();
m.modelType = 'PeopleAreString!';
m.attributes[0].value = 90210;
new SurrogateStore().deleteModel(m, function (mod, err) {
  if (err) {
    callback(err);
  } else {
    callback(mod);
  }
});
```
<blockquote>returns <strong>Error: model not found in store</strong> as expected
</blockquote>
#### getList(model, filter, order)
This method will clear and populate the list with collection from store.  The **filter** property can be used to query the store.  The **order** property can specify the sort order of the list.  _See integration test for more info._    

&nbsp;<b><i>returns a List populated from store:</i></b>
```javascript
this.shouldThrowError(Error('argument must be a List'), function () {
  new SurrogateStore().getList();
});
this.shouldThrowError(Error('filter argument must be Object'), function () {
  new SurrogateStore().getList(new List(new Model()));
});
this.shouldThrowError(Error('callBack required'), function () {
  new SurrogateStore().getList(new List(new Model()), []);
});
// See integration tests for examples of usage
```
#### Store Integration
#### CRUD (Create Read Update Delete)
&nbsp;<b><i>Exercise all store function for one store.:</i></b>
```javascript
var self = this;
spec.integrationStore = new SurrogateStore();
var storeBeingTested = spec.integrationStore.name + ' ' + spec.integrationStore.storeType;
self.log(storeBeingTested);
// If store is not ready then get out...
if (!spec.integrationStore.getServices().isReady) {
  self.log('Store is not ready.');
  callback(true);
  return;
}
// setup stooge class
self.Stooge = function (args) {
  Model.call(this, args);
  this.modelType = "_tempTest_Stooge";
  this.attributes.push(new Attribute('name'));
};
self.Stooge.prototype = inheritPrototype(Model.prototype);
// create initial stooges
self.moe = new self.Stooge();
self.moe.set('name', 'Moe');
self.larry = new self.Stooge();
self.larry.set('name', 'Larry');
self.shemp = new self.Stooge();
self.shemp.set('name', 'Shemp');
// IDs after stored will be here
self.stoogeIDsStored = [];
self.stoogesRetrieved = [];
self.oldStoogesFound = 0;
self.oldStoogesKilled = 0;
// Make sure store starts in known state.  Stores such as mongoStore will retain test values.
// So... use getList to get all stooges then delete them from the Store
var useListToCleanStart = spec.integrationStore.getServices().canGetList;
if (useListToCleanStart) {
  var list = new List(new self.Stooge());
  try {
    self.killhim = new self.Stooge();
    spec.integrationStore.getList(list, [], function (list, error) {
      if (typeof error != 'undefined') {
        callback(error);
        return;
      }
      if (list._items.length < 1)
        storeStooges();
      else
        self.oldStoogesFound = list._items.length;
      for (var i = 0; i < list._items.length; i++) {
        self.killhim.set('id', list._items[i][0]);
        /* jshint ignore:start */
        spec.integrationStore.deleteModel(self.killhim, function (model, error) {
          if (++self.oldStoogesKilled >= self.oldStoogesFound) {
            storeStooges();
          }
        })
        /* jshint ignore:end */
      }
    });
  }
  catch (err) {
    callback(err);
  }
} else {
  storeStooges();
}
// Callback to store new stooges
function storeStooges() {
  self.log(self.oldStoogesFound);
  self.log(self.oldStoogesKilled);
  spec.integrationStore.putModel(self.moe, stoogeStored);
  spec.integrationStore.putModel(self.larry, stoogeStored);
  spec.integrationStore.putModel(self.shemp, stoogeStored);
}
// callback after storing stooges
function stoogeStored(model, error) {
  if (typeof error != 'undefined') {
    callback(error);
    return;
  }
  try {
    self.stoogeIDsStored.push(model.get('id'));
    if (self.stoogeIDsStored.length == 3) {
      self.shouldBeTrue(true,'here');
      // Now that first 3 stooges are stored lets retrieve and verify
      var actors = [];
      for (var i = 0; i < 3; i++) {
        actors.push(new self.Stooge());
        actors[i].set('id', self.stoogeIDsStored[i]);
        spec.integrationStore.getModel(actors[i], stoogeRetrieved);
      }
    }
  }
  catch (err) {
    callback(err);
  }
}
// callback after retrieving stored stooges
function stoogeRetrieved(model, error) {
  if (typeof error != 'undefined') {
    callback(error);
    return;
  }
  self.stoogesRetrieved.push(model);
  if (self.stoogesRetrieved.length == 3) {
    self.shouldBeTrue(true,'here');
    // Now we have stored and retrieved (via IDs into new objects).  So verify the stooges made it
    self.shouldBeTrue(self.stoogesRetrieved[0] !== self.moe && // Make sure not a reference but a copy
    self.stoogesRetrieved[0] !== self.larry && self.stoogesRetrieved[0] !== self.shemp,'copy');
    var s = []; // get list of names to see if all stooges made it
    for (var i = 0; i < 3; i++) s.push(self.stoogesRetrieved[i].get('name'));
    self.log(s);
    self.shouldBeTrue(contains(s, 'Moe') && contains(s, 'Larry') && contains(s, 'Shemp'));
    // Replace Shemp with Curly
    var didPutCurly = false;
    for (i = 0; i < 3; i++) {
      if (self.stoogesRetrieved[i].get('name') == 'Shemp') {
        didPutCurly = true;
        self.stoogesRetrieved[i].set('name', 'Curly');
        try {
          spec.integrationStore.putModel(self.stoogesRetrieved[i], stoogeChanged);
        }
        catch (err) {
          callback(err);
        }
      }
    }
    if (!didPutCurly) {
      callback(Error("Can't find Shemp!"));
    }
  }
}
// callback after storing changed stooge
function stoogeChanged(model, error) {
  if (typeof error != 'undefined') {
    callback(error);
    return;
  }
  self.shouldBeTrue(model.get('name') == 'Curly','Curly');
  var curly = new self.Stooge();
  curly.set('id', model.get('id'));
  try {
    spec.integrationStore.getModel(curly, storeChangedShempToCurly);
  }
  catch (err) {
    callback(err);
  }
}
// callback after retrieving changed stooge
function storeChangedShempToCurly(model, error) {
  if (typeof error != 'undefined') {
    callback(error);
    return;
  }
  self.shouldBeTrue(model.get('name') == 'Curly','Curly');
  // Now test delete
  self.deletedModelId = model.get('id'); // Remember this
  spec.integrationStore.deleteModel(model, stoogeDeleted);
}
// callback when Curly is deleted
function stoogeDeleted(model, error) {
  if (typeof error != 'undefined') {
    callback(error);
    return;
  }
  // model parameter is what was deleted
  self.shouldBeTrue(undefined === model.get('id')); // ID removed
  self.shouldBeTrue(model.get('name') == 'Curly'); // the rest remains
  // Is it really dead?
  var curly = new self.Stooge();
  curly.set('id', self.deletedModelId);
  spec.integrationStore.getModel(curly, hesDeadJim);
}
// callback after lookup of dead stooge
function hesDeadJim(model, error) {
  if (typeof error != 'undefined') {
    if ((error != 'Error: id not found in store') && (error != 'Error: model not found in store')) {
      callback(error);
      return;
    }
  } else {
    callback(Error('no error deleting stooge when expected'));
    return;
  }
  // Skip List test if subclass can't do
  if (!spec.integrationStore.getServices().canGetList) {
    callback(true);
  } else {
    // Now create a list from the stooge store
    var list = new List(new self.Stooge());
    try {
      spec.integrationStore.getList(list, {}, {name:1}, listReady);
    }
    catch (err) {
      callback(err);
    }
  }
}
// callback after list created from store
function listReady(list, error) {
//          list.sort({name:1});
  if (typeof error != 'undefined') {
    callback(error);
    return;
  }
  self.shouldBeTrue(list instanceof List,'is list');
  self.shouldBeTrue(list.length() == 2,'is 2');
  list.moveFirst();
  self.shouldBeTrue(list.get('name') == 'Larry','larry');
  list.moveNext();
  self.shouldBeTrue(list.get('name') == 'Moe','moe');
  callback(true);
}
```
<blockquote><strong>log: </strong>Moe,Larry,Shemp<br><strong>log: </strong>0<br><strong>log: </strong>0<br><strong>log: </strong>a MemoryStore MemoryStore<br>returns <strong>true</strong> as expected
</blockquote>
## [&#9664;](#-memorystore)&nbsp;[&#8984;](#table-of-contents) &nbsp;Summary
This documentation generated with https://github.com/tgicloud/tgi-spec.<br>TODO put testin stats here.    
