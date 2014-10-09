/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/misc/lib-header
 **/
(function () {
"use strict";
var root = this;
/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core.js
 **/
var CORE = function () {
  return {
    version: '0.0.7',
    Attribute: Attribute,
    Command: Command,
    Model: Model,
    injectMethods: function (that) {
      that.Attribute = Attribute;
      that.Command = Command;
      that.Model = Model;
    }
  };
};
/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-attribute.source.js
 */
/*
 * Constructor
 */
function Attribute(args, arg2) {
  var splitTypes; // For String(30) type
  if (false === (this instanceof Attribute)) throw new Error('new operator required');
  if (typeof args == 'string') {
    var quickName = args;
    args = {};
    args.name = quickName;
    if (typeof arg2 == 'string') {
      args.type = arg2;
    }
  }
  args = args || {};
  this.name = args.name || null;
  this.label = args.label || args.name;
  if (this.label)
    this.label = this.label.charAt(0).toUpperCase() + this.label.slice(1);
  this.type = args.type || 'String';
  splitTypes = function (str) { // for String(30) remove right of (
    var tmpSplit = str.split('(');
    tmpSplit[1] = parseInt(tmpSplit[1]);
    return tmpSplit;
  }(this.type);
  this.type = splitTypes[0];
  this.hint = args.hint || {};
  this.validationRule = args.validationRule || {};
  var unusedProperties = [];
  var standardProperties = ['name', 'type', 'label', 'hint', 'value', 'validationRule'];
  switch (this.type) {
    case 'ID':
      unusedProperties = getInvalidProperties(args, standardProperties);
      this.value = args.value || null;
      break;
    case 'String':
      unusedProperties = getInvalidProperties(args, standardProperties.concat(['placeHolder', 'quickPick', 'size']));
      this.size = splitTypes[1] ? splitTypes[1] : typeof args.size == 'number' ? args.size : args.size || 50;
      this.value = args.value || null;
      if (args.quickPick)
        this.quickPick = args.quickPick;
      this.placeHolder = args.placeHolder || null;
      break;
    case 'Date':
      unusedProperties = getInvalidProperties(args, standardProperties.concat('placeHolder'));
      this.value = args.value || null;
      this.placeHolder = args.placeHolder || null;
      break;
    case 'Boolean':
      unusedProperties = getInvalidProperties(args, standardProperties);
      if (args.value === false)
        this.value = false;
      else
        this.value = args.value || null;
      break;
    case 'Number':
      unusedProperties = getInvalidProperties(args, standardProperties.concat('placeHolder'));
      if (args.value === 0)
        this.value = 0;
      else
        this.value = args.value || null;
      this.placeHolder = args.placeHolder || null;
      break;
    case 'Model':
      unusedProperties = getInvalidProperties(args, standardProperties);
      this.value = args.value || null;
      if (this.value instanceof Attribute.ModelID)
        this.modelType = this.value.modelType;
      break;
    case 'Group':
      unusedProperties = getInvalidProperties(args, standardProperties);
      this.value = args.value || null;
      break;
    case 'Table':
      unusedProperties = getInvalidProperties(args, standardProperties.concat('group'));
      this.value = args.value || null;
      this.group = args.group || null;
      break;
    case 'Object':
      unusedProperties = getInvalidProperties(args, standardProperties);
      this.value = args.value || null;
      break;
    default:
      break;
  }
  var errorList = this.getObjectStateErrors(); // before leaving make sure valid Attribute
  for (var i = 0; i < unusedProperties.length; i++) errorList.push('invalid property: ' + unusedProperties[i]);
  if (errorList.length > 1) throw new Error('error creating Attribute: multiple errors');
  if (errorList.length) throw new Error('error creating Attribute: ' + errorList[0]);

  // Validations done
  this._eventListeners = [];
  this._errorConditions = {};
}
/*
 * Additional Constructors
 */
Attribute.ModelID = function (model) {
  if (false === (this instanceof Attribute.ModelID)) throw new Error('new operator required');
  if (false === (model instanceof Model)) throw new Error('must be constructed with Model');
  this.value = model.get('id');
  this.constructorFunction = model.constructor;
  this.modelType = model.modelType;
};
Attribute.ModelID.prototype.toString = function () {
  if (typeof this.value == 'string')
    return 'ModelID(' + this.modelType + ':\'' + this.value + '\')';
  else
    return 'ModelID(' + this.modelType + ':' + this.value + ')';
};
/*
 * Methods
 */
Attribute.prototype.toString = function () {
  return this.name === null ? 'new Attribute' : 'Attribute: ' + this.name;
};
Attribute.prototype.onEvent = function (events, callback) {
  if (!(events instanceof Array)) {
    if (typeof events != 'string') throw new Error('subscription string or array required');
    events = [events]; // coerce to array
  }
  if (typeof callback != 'function') throw new Error('callback is required');
  // Check known Events
  for (var i in events) {
    if (events.hasOwnProperty(i))
      if (events[i] != '*')
        if (!contains(['StateChange', 'Validate'], events[i]))
          throw new Error('Unknown command event: ' + events[i]);
  }
  // All good add to chain
  this._eventListeners.push({events: events, callback: callback});
  return this;
};
Attribute.prototype._emitEvent = function (event) {
  var i;
  for (i in this._eventListeners) {
    if (this._eventListeners.hasOwnProperty(i)) {
      var subscriber = this._eventListeners[i];
      if ((subscriber.events.length && subscriber.events[0] === '*') || contains(subscriber.events, event)) {
        subscriber.callback.call(this, event);
      }
    }
  }
};
Attribute.prototype.coerce = function (value) {
  var newValue = value;
  var temp;
  switch (this.type) {
    case 'String':
      if (typeof newValue == 'undefined') return '';
      if (typeof newValue == 'boolean' && !newValue) return 'false';
      if (!newValue) return '';
      newValue = value.toString();
      if (newValue.length > this.size) return newValue.substring(0, this.size);
      return newValue;
    case 'Number':
      if (typeof newValue == 'undefined') return 0;
      if (!newValue) return 0;
      if (typeof newValue == 'string') {
        newValue = newValue.replace(/^\s+|\s+$/g, ''); // trim
        temp = newValue.split(' ');
        newValue = temp.length ? temp[0] : '';
        newValue = Number(newValue.replace(/[^/0-9\ \.]+/g, ""));
      } else {
        newValue = Number(newValue);
      }
      if (!newValue) return 0;
      return newValue;
    case 'Boolean':
      if (typeof newValue == 'undefined') return false;
      if (typeof newValue == 'string') {
        newValue = newValue.toUpperCase();
        if (newValue === 'Y' || newValue === 'YES' || newValue === 'T' || newValue === 'TRUE' || newValue === '1')
          return true;
        return false;
      }
      return (newValue ? true : false); // truthy all we need
    case 'Date':
      if (typeof newValue == 'string') {
        if (newValue.split('/').length == 2)
          newValue = newValue + '/' + new Date().getFullYear();

      }
      return new Date(newValue);
  }
  throw(Error('coerce cannot determine appropriate value'));
};
Attribute.prototype.getObjectStateErrors = function () {
  var i;
  this.validationErrors = [];
  if (!this.name) this.validationErrors.push('name required');
  if (!contains(['ID', 'String', 'Date', 'Boolean', 'Number', 'Model', 'Group', 'Table', 'Object'], this.type))
    this.validationErrors.push('Invalid type: ' + this.type);
  switch (this.type) {
    case 'ID':
      break;
    case 'String':
      if (typeof this.size != 'number') this.validationErrors.push('size must be a number from 1 to 255');
      if (this.size < 1 || this.size > 255) this.validationErrors.push('size must be a number from 1 to 255');
      if (!(this.value === null || typeof this.value === 'string')) this.validationErrors.push('value must be null or a String');
      break;
    case 'Date':
      if (!(this.value === null || this.value instanceof Date)) this.validationErrors.push('value must be null or a Date');
      break;
    case 'Boolean':
      if (!(this.value === null || typeof this.value == 'boolean')) this.validationErrors.push('value must be null or a Boolean');
      break;
    case 'Number':
      if (!(this.value === null || typeof this.value == 'number')) this.validationErrors.push('value must be null or a Number');
      break;
    case 'Model':
      if (!(this.value instanceof Attribute.ModelID)) this.validationErrors.push('value must be Attribute.ModelID');
      break;
    case 'Group':
      if (this.value === null || this.value instanceof Array) {
        for (i in this.value) {
          if (this.value.hasOwnProperty(i)) {
            if (!(this.value[i] instanceof Attribute)) this.validationErrors.push('each element in group must be instance of Attribute');
            if (this.value[i].getObjectStateErrors().length) this.validationErrors.push('group contains invalid members');
          }
        }
      } else {
        this.validationErrors.push('value must be null or an array');
      }
      break;
    case 'Table':
      if (!(this.group instanceof Attribute)) {
        this.validationErrors.push('group property required');
      } else {
        if (this.group.value instanceof Array) {
          if (this.group.value.length < 1) {
            this.validationErrors.push('group property value must contain at least one Attribute');
          } else {
            for (i in this.group.value) {
              if (this.group.value.hasOwnProperty(i)) {
                if (!(this.group.value[i] instanceof Attribute)) this.validationErrors.push('each element in group must be instance of Attribute');
                if (this.group.value[i].getObjectStateErrors().length) this.validationErrors.push('group contains invalid members');
              }
            }
          }
        } else {
          this.validationErrors.push('group.value must be an array');
        }
      }
      break;
    default:
      break;
  }
  var validationRuleBadProps = getInvalidProperties(this.validationRule, ['required', 'range', 'isOneOf', 'isValidModel']);
  if (validationRuleBadProps.length)
    this.validationErrors.push('invalid validationRule: ' + validationRuleBadProps);
  this.validationMessage = this.validationErrors.length > 0 ? this.validationErrors[0] : '';
  return this.validationErrors;
};
Attribute.prototype.validate = function (callBack) {
  if (typeof callBack != 'function') throw new Error('callback is required');
  // First check object state
  this.getObjectStateErrors();
  this._emitEvent('Validate');
  var e;
  for (e in this._errorConditions) {
    if (this._errorConditions.hasOwnProperty(e)) {
      this.validationErrors.push(this._errorConditions[e]);
    }
  }
  // Check validation rules for attribute
  if (this.validationRule.required && !this.value) {
    if (this.type == 'Number') {
      if (this.value !== 0)
        this.validationErrors.push(this.label + ' required');
    } else if (this.type == 'Boolean') {
      if (this.value !== false)
        this.validationErrors.push(this.label + ' required');
    } else {
      this.validationErrors.push(this.label + ' required');
    }
  }
  if (this.validationRule.range) {
    if (!(this.validationRule.range instanceof Array)) {
      this.validationRule.range = [this.validationRule.range]; // coerce to array
    }
    if (this.validationRule.range[0] || this.validationRule.range[0] === 0) {
      if (this.value < this.validationRule.range[0])
        this.validationErrors.push(this.label + ' must be at least ' + this.validationRule.range[0]);
    }
    if (this.validationRule.range[1] || this.validationRule.range[1] === 0) {
      if (this.value > this.validationRule.range[1])
        this.validationErrors.push(this.label + ' must be no more than ' + this.validationRule.range[1]);
    }
  }
  if (this.validationRule.isOneOf) {
    if (!(this.validationRule.isOneOf instanceof Array)) {
      this.validationRule.isOneOf = [this.validationRule.isOneOf]; // coerce to array
    }
    if (this.validationRule.isOneOf.indexOf(this.value) == -1)
      this.validationErrors.push(this.label + ' invalid');
  }

  // All done...
  this.validationMessage = this.validationErrors.length > 0 ? this.validationErrors[0] : '';
  this._emitEvent('StateChange');
  callBack.call(this);
};
Attribute.prototype.setError = function (condition, description) {
  condition = condition || '';
  description = description || '';
  if (!condition) throw new Error('condition required');
  if (!description) throw new Error('description required');
  this._errorConditions[condition] = description;
};
Attribute.prototype.clearError = function (condition) {
  condition = condition || '';
  if (!condition) throw new Error('condition required');
  delete this._errorConditions[condition];
};
Attribute.getAttributeTypes = function () {
  return ['ID', 'String', 'Date', 'Boolean', 'Number', 'Model', 'Group', 'Table', 'Object'].slice(0); // copy array
};
/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-command.source.js
 */
// Command Constructor
function Presentation() {
}
function Procedure() {
}
function Command(/* does this matter */ args) {
  if (false === (this instanceof Command)) throw new Error('new operator required');
  if (typeof args == 'function') { // shorthand for function command
    var theFunc = args;
    args = {type: 'Function', contents: theFunc};
  }
  args = args || {};
  var i;
  var unusedProperties = getInvalidProperties(args,
    ['name', 'description', 'type', 'contents', 'scope', 'timeout', 'theme', 'icon', 'bucket']);
  var errorList = [];
  for (i = 0; i < unusedProperties.length; i++) errorList.push('invalid property: ' + unusedProperties[i]);
  if (errorList.length > 1) throw new Error('error creating Command: multiple errors');
  if (errorList.length) throw new Error('error creating Command: ' + errorList[0]);
  for (i in args) this[i] = args[i];
  this.name = this.name || "(unnamed)"; // name is optional
  if ('string' != typeof this.name) throw new Error('name must be string');
  if ('undefined' == typeof this.description) this.description = this.name + ' Command';
  if ('undefined' == typeof this.type) this.type = 'Stub';
  if (!contains(['Stub', 'Menu', 'Presentation', 'Function', 'Procedure'], this.type)) throw new Error('Invalid command type: ' + this.type);
  switch (this.type) {
    case 'Stub':
      break;
    case 'Menu':
      if (!(this.contents instanceof Array)) throw new Error('contents must be array of menu items');
      if (!this.contents.length) throw new Error('contents must be array of menu items');
      for (i in this.contents) {
        if (this.contents.hasOwnProperty(i))
          if (typeof this.contents[i] != 'string' && !(this.contents[i] instanceof Command))
            throw new Error('contents must be array of menu items');
      }
      break;
    case 'Presentation':
      if (!(this.contents instanceof Presentation)) throw new Error('contents must be a Presentation');
      break;
    case 'Function':
      if (typeof this.contents != 'function') throw new Error('contents must be a Function');
      break;
    case 'Procedure':
      if (!(this.contents instanceof Procedure)) throw new Error('contents must be a Procedure');
      break;
  }
  if ('undefined' != typeof this.scope)
    if (!((this.scope instanceof Model) || (this.scope instanceof List)))
      throw new Error('optional scope property must be Model or List');
  if ('undefined' != typeof this.timeout)
    if (typeof this.timeout != 'number') throw new Error('timeout must be a Number');
  if ('undefined' != typeof this.timeout)
    if (typeof this.timeout != 'number') throw new Error('timeout must be a Number');
  if ('undefined' != typeof this.theme) {
    if ('string' != typeof this.theme) throw new Error('invalid theme');
    if (!contains(['default', 'primary', 'success', 'info', 'warning', 'danger', 'link'], this.theme))
      throw new Error('invalid theme');
  }
  if ('undefined' != typeof this.icon) {
    if ('string' != typeof this.icon) throw new Error('invalid icon');
    if (!contains(['fa', 'glyphicon'], this.icon.split('-')[0]) || !this.icon.split('-')[1])
      throw new Error('invalid icon');
  }

  // Validations done
  this._eventListeners = [];
}
/*
 * Methods
 */
Command.prototype.toString = function () {
  return this.type + ' Command: ' + this.name;
};
Command.prototype.onEvent = function (events, callback) {
  if (!(events instanceof Array)) {
    if (typeof events != 'string') throw new Error('subscription string or array required');
    events = [events]; // coerce to array
  }
  if (typeof callback != 'function') throw new Error('callback is required');
  // Check known Events
  for (var i in events) {
    if (events.hasOwnProperty(i))
      if (events[i] != '*')
        if (!contains(['BeforeExecute', 'AfterExecute', 'Error', 'Aborted', 'Completed'], events[i]))
          throw new Error('Unknown command event: ' + events[i]);
  }
  // All good add to chain
  this._eventListeners.push({events: events, callback: callback});
};
Command.prototype._emitEvent = function (event) {
  var i;
  for (i in this._eventListeners) {
    if (this._eventListeners.hasOwnProperty(i)) {
      var subscriber = this._eventListeners[i];
      if ((subscriber.events.length && subscriber.events[0] === '*') || contains(subscriber.events, event)) {
        subscriber.callback.call(this, event);
      }
    }
  }
  if (event == 'Completed') // if command complete release listeners
    this._eventListeners = [];
};
Command.prototype.execute = function () {
  if (!this.type) throw new Error('command not implemented');
  if (!contains(['Function', 'Procedure', 'Presentation'], this.type)) throw new Error('command type ' + this.type + ' not implemented');
  var errors;
  switch (this.type) {
    case 'Presentation':
      if (!(this.contents instanceof Presentation)) throw new Error('contents must be a Presentation');
      errors = this.contents.getObjectStateErrors();
      if (errors.length) {
        if (errors.length > 1)
          throw new Error('error executing Presentation: multiple errors');
        else
          throw new Error('error executing Presentation: ' + errors[0]);
      }
      break;
  }
  var self = this;
  var args = arguments;
  this._emitEvent('BeforeExecute');
  try {
    switch (this.type) {
      case 'Function':
        this.status = 0;
        setTimeout(callFunc, 0);
        break;
      case 'Procedure':
        setTimeout(procedureExecute, 0);
        break;
    }
  } catch (e) {
    this.error = e;
    this._emitEvent('Error');
    this._emitEvent('Completed');
    this.status = -1;
  }
  this._emitEvent('AfterExecute');
  function callFunc() {
    try {
      self.contents.apply(self, args); // give function this context to command object (self)
    } catch (e) {
      self.error = e;
      self._emitEvent('Error');
      self._emitEvent('Completed');
      self.status = -1;
    }
  }

  function procedureExecute() {
    self.status = 0;
    var tasks = self.contents.tasks || [];
    for (var t = 0; t < tasks.length; t++) {
      // shorthand for function command gets coerced into longhand
      if (typeof tasks[t] == 'function') {
        var theFunc = tasks[t];
        tasks[t] = {requires: [-1], command: new Command({type: 'Function', contents: theFunc})};
      }
      // Initialize if not done
      if (!tasks[t].command._parentProcedure) {
        tasks[t].command._taskIndex = t;
        tasks[t].command._parentProcedure = self;
        tasks[t].command.onEvent('*', ProcedureEvents);
      }
      // Execute if it is time
      var canExecute = true;
      if (typeof (tasks[t].command.status) == 'undefined') {
        for (var r in tasks[t].requires) {
          if (typeof tasks[t].requires[r] == 'string') { // label of task needed to complete
            for (var l = 0; l < tasks.length; l++) {
              if (tasks[l].label == tasks[t].requires[r])
                if (!tasks[l].command.status || tasks[l].command.status <= 0) {
                  canExecute = false;
                }
            }
          }
          if (typeof tasks[t].requires[r] == 'number') {
            if (tasks[t].requires[r] == -1) { // previous task needed to complete?
              if (t != '0') { // first one always runs
                if (!tasks[t - 1].command.status || tasks[t - 1].command.status <= 0) {
                  canExecute = false;
                }
              }
            } else {
              var rq = tasks[t].requires[r];
              if (!tasks[rq].command.status || tasks[rq].command.status <= 0) {
                canExecute = false;
              }
            }
          }
        }
        if (canExecute) {
          tasks[t].command.execute();
        }
      }
    }
  }

  function ProcedureEvents(event) {
    var tasks = self.contents.tasks;
    var allTasksDone = true; // until proved wrong ...
    switch (event) {
      case 'Error':
        self._emitEvent('Error');
        break;
      case 'Completed':
        for (var t in tasks) {
          if (tasks.hasOwnProperty(t)) {
            if (!tasks[t].command.status || tasks[t].command.status === 0) {
              allTasksDone = false;
            }
          }
        }
        if (allTasksDone)
          self.complete(); // todo when all run
        else
          procedureExecute();
        break;
    }
  }
};
Command.prototype.abort = function () {
  this._emitEvent('Aborted');
  this.status = -1;
  this._emitEvent('Completed');
};
Command.prototype.complete = function () {
  this.status = 1;
  this._emitEvent('Completed');
};

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/xxx/tgi-core-delta.source
 */

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/xxx/tgi-core-interface.source
 */

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-list.source.js
 */
// Constructor
var List = function (model) {
  if (false === (this instanceof List)) throw new Error('new operator required');
  if (false === (model instanceof Model)) throw new Error('argument required: model');
  this.model = model; // todo make unit test for this
  this._items = [];
  this._itemIndex = -1;
};
List.prototype.length = function () {
  return this._items.length;
};
List.prototype.clear = function () {
  this._items = [];
  this._itemIndex = -1;
  return this;
};
List.prototype.get = function (attribute) {
  if (this._items.length < 1) throw new Error('list is empty');
  for (var i = 0; i < this.model.attributes.length; i++) {
    if (this.model.attributes[i].name.toUpperCase() == attribute.toUpperCase())
      return this._items[this._itemIndex][i];
  }
};
List.prototype.set = function (attribute,value) {
  if (this._items.length < 1) throw new Error('list is empty');
  for (var i = 0; i < this.model.attributes.length; i++) {
    if (this.model.attributes[i].name.toUpperCase() == attribute.toUpperCase()) {
      this._items[this._itemIndex][i] = value;
      return;
    }
  }
  throw new Error('attribute not valid for list model');
};
List.prototype.addItem = function (item) {
  var i;
  var values = [];
  if (item) {
    for (i in item.attributes) {
      values.push(item.attributes[i].value);
    }
  } else {
    for (i in this.model.attributes) {
      values.push(undefined);
    }
  }
  this._items.push(values);
  this._itemIndex = this._items.length - 1;
  return this;
};
List.prototype.removeItem = function (item) {
  this._items.splice(this._itemIndex, 1);
  this._itemIndex--;
  return this;
};
List.prototype.indexedItem = function (index) {
  if (this._items.length < 1) return false;
  if (index < 0) return false;
  if (index >= this._items.length) return false;
  this._itemIndex = index;
  return true;
};
List.prototype.moveNext = function () {
  if (this._items.length < 1) return false;
  return this.indexedItem(this._itemIndex + 1);
};
List.prototype.movePrevious = function () {
  if (this._items.length < 1) return false;
  return this.indexedItem(this._itemIndex - 1);
};
List.prototype.moveFirst = function () {
  if (this._items.length < 1) return false;
  return this.indexedItem(0);
};
List.prototype.moveLast = function () {
  if (this._items.length < 1) return false;
  return this.indexedItem(this._items.length - 1);
};
List.prototype.sort = function (key) {
  var i = 0;
  var keyvalue;
  for (var keyName in key) {
    if (!keyvalue) keyvalue = keyName;
  }
  if (!keyvalue) throw new Error('sort order required');
  var ascendingSort = (key[keyvalue] == 1);
  while (i < this.model.attributes.length && this.model.attributes[i].name != keyvalue) i++;
  this._items.sort(function (a, b) {
    if (ascendingSort) {
      if (a[i] < b[i])
        return -1;
      if (a[i] > b[i])
        return 1;
    } else {
      if (a[i] > b[i])
        return -1;
      if (a[i] < b[i])
        return 1;
    }
    return 0;
  });
};

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-model.source.js
 */
/**
 * Model Constructor
 */
var Model = function (args) {
  var i;
  if (false === (this instanceof Model)) throw new Error('new operator required');
  this.modelType = "Model";
  this.attributes = [new Attribute('id', 'ID')];
  args = args || {};
  if (args.attributes) {
    for (i in args.attributes) {
      if (args.attributes.hasOwnProperty(i))
        this.attributes.push(args.attributes[i]);
    }
  }
  var unusedProperties = getInvalidProperties(args, ['attributes']);
  var errorList = this.getObjectStateErrors(); // before leaving make sure valid Model
  for (i = 0; i < unusedProperties.length; i++) errorList.push('invalid property: ' + unusedProperties[i]);
  if (errorList.length > 1) throw new Error('error creating Model: multiple errors');
  if (errorList.length) throw new Error('error creating Model: ' + errorList[0]);
  // Validations done
  this._eventListeners = [];
  this._errorConditions = {};
};
// Methods
Model.prototype.toString = function () {
  return "a " + this.modelType;
};
Model.prototype.copy = function (sourceModel) {
  for (var i = 0; i < this.attributes.length; i++) {
    //if (args.attributes.hasOwnProperty(i))
    this.attributes[i].value = sourceModel.attributes[i].value;
  }
};
Model.prototype.getObjectStateErrors = function () {
  this.validationErrors = [];
  // check attributes
  if (!(this.attributes instanceof Array)) {
    this.validationErrors.push('attributes must be Array');
  } else {
    if (this.attributes.length < 1) {
      this.validationErrors.push('attributes must not be empty');
    } else {
      for (var i = 0; i < this.attributes.length; i++) {
        if (i === 0 && (!(this.attributes[i] instanceof Attribute) || this.attributes[i].type != "ID")) this.validationErrors.push('first attribute must be ID');
        if (!(this.attributes[i] instanceof Attribute)) this.validationErrors.push('attribute must be Attribute');
      }
    }
  }
  // check tags
  if (this.tags !== undefined && !(this.tags instanceof Array)) {
    this.validationErrors.push('tags must be Array or null');
  }
  return this.validationErrors;
};
Model.prototype.get = function (attribute) {
  for (var i = 0; i < this.attributes.length; i++) {
    if (this.attributes[i].name.toUpperCase() == attribute.toUpperCase())
      return this.attributes[i].value;
  }
};
Model.prototype.getAttributeType = function (attribute) {
  for (var i = 0; i < this.attributes.length; i++) {
    if (this.attributes[i].name.toUpperCase() == attribute.toUpperCase())
      return this.attributes[i].type;
  }
};
Model.prototype.set = function (attribute, value) {
  for (var i = 0; i < this.attributes.length; i++) {
    if (this.attributes[i].name.toUpperCase() == attribute.toUpperCase()) {
      this.attributes[i].value = value;
      return;
    }
  }
  throw new Error('attribute not valid for model');
};
Model.prototype.validate = function (callBack) {
  var model = this;
  var i, e;
  var validationsPending = 0; // track callbacks sent
  if (typeof callBack != 'function') throw new Error('callback is required');
  // First check object state
  model.getObjectStateErrors();
  for (e in model._errorConditions) {
    if (model._errorConditions.hasOwnProperty(e)) {
      model.validationErrors.push(model._errorConditions[e]);
    }
  }
  // If model wrong here abort attribute tests
  if (model.validationErrors.length) {
    model.validationMessage = model.validationErrors.length > 0 ? model.validationErrors[0] : '';
    model._emitEvent('StateChange');
    callBack.call(model);
    return;
  }

  // Now check each attribute
  /* jshint ignore:start */ // todo Don't make functions within a loop.
  for (i = 0; i < model.attributes.length; i++) {
    validationsPending++;
    (function (curAttribute) {
      setTimeout(function () {
        curAttribute.validate(function () {
          if (curAttribute.validationErrors.length) {
            model.validationErrors.push('bush');
          }
          // done with this one - see if done with all
          if (--validationsPending === 0) {
            /** Final test is here ... **/
            // If no errors in attributes validate model
            if (!model.validationErrors.length)
              model._emitEvent('Validate');
            // Finally done here!
            model.validationMessage = model.validationErrors.length > 0 ? model.validationErrors[0] : '';
            model._emitEvent('StateChange');
            callBack.call(model);
          }
        });
      }, 0);
    }(model.attributes[i]));
  }
  /* jshint ignore:end */

//  // All done...
//  this.validationMessage = this.validationErrors.length > 0 ? this.validationErrors[0] : '';
//  this._emitEvent('StateChange');
//  callBack.call(this);

};
Model.prototype.onEvent = function (events, callback) {
  if (!(events instanceof Array)) {
    if (typeof events != 'string') throw new Error('subscription string or array required');
    events = [events]; // coerce to array
  }
  if (typeof callback != 'function') throw new Error('callback is required');
  // Check known Events
  for (var i in events) {
    if (events.hasOwnProperty(i))
      if (events[i] != '*')
        if (!contains(['StateChange', 'Validate'], events[i]))
          throw new Error('Unknown command event: ' + events[i]);
  }
  // All good add to chain
  this._eventListeners.push({events: events, callback: callback});
  return this;
};
Model.prototype._emitEvent = function (event) {
  var i;
  for (i in this._eventListeners) {
    if (this._eventListeners.hasOwnProperty(i)) {
      var subscriber = this._eventListeners[i];
      if ((subscriber.events.length && subscriber.events[0] === '*') || contains(subscriber.events, event)) {
        subscriber.callback.call(this, event);
      }
    }
  }
};
Model.prototype.setError = function (condition, description) {
  condition = condition || '';
  description = description || '';
  if (!condition) throw new Error('condition required');
  if (!description) throw new Error('description required');
  this._errorConditions[condition] = description;
};
Model.prototype.clearError = function (condition) {
  condition = condition || '';
  if (!condition) throw new Error('condition required');
  delete this._errorConditions[condition];
};
/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/xxx/tgi-core-message.source
 */

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/xxx/tgi-core-procedure.source
 */

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/xxx/tgi-core-request.source
 */

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/xxx/tgi-core-store.source
 */

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/xxx/tgi-core-transport.source
 */

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/misc/lib-footer
 **/
  /* istanbul ignore next */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = CORE;
    }
    exports.CORE = CORE;
  } else {
    root.CORE = CORE;
  }
}).call(this);