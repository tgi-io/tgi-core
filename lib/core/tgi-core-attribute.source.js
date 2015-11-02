/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-attribute.source.js
 */
/**
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
/**
 * Additional Constructors
 */
Attribute.ModelID = function (model) {
  if (false === (this instanceof Attribute.ModelID)) throw new Error('new operator required');
  if (false === (model instanceof Model)) throw new Error('must be constructed with Model');
  this.value = model.get('id');
  this.name = model.getShortName();
  this.constructorFunction = model.constructor;
  this.modelType = model.modelType;
};
Attribute.ModelID.prototype.toString = function () {
  if (typeof this.value == 'string')
    return 'ModelID(' + this.modelType + ':\'' + this.value + '\')';
  else
    return 'ModelID(' + this.modelType + ':' + this.value + ')';
};
/**
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
Attribute.prototype.offEvent = function () {
  this._eventListeners = [];
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
Attribute.prototype.get = function () {
  return this.value;
};
Attribute.prototype.set = function (newValue) {
  this.value = newValue;
  this._emitEvent('StateChange');
  return this.value;
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
Attribute.prototype.validate = function (callback) {
  if (typeof callback != 'function') throw new Error('callback is required');
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
  callback.call(this);
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
/**
 * Simple functions
 */
Attribute.getTypes = function () {
  return ['ID', 'String', 'Date', 'Boolean', 'Number', 'Model', 'Group', 'Table', 'Object'].slice(0); // copy array
};
Attribute.getEvents = function () {
  return ['StateChange', 'Validate'].slice(0); // copy array
};