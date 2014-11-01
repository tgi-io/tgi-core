/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core.js
 **/
var CORE = function () {
  return {
    version: '0.0.7',
    Application: Application,
    Attribute: Attribute,
    Command: Command,
    Delta: Delta,
    Interface: Interface,
    List: List,
    Log: Log,
    MemoryStore: MemoryStore,
    Message: Message,
    Model: Model,
    Presentation: Presentation,
    Procedure: Procedure,
    Request: Request,
    Session: Session,
    Store: Store,
    Transport: Transport,
    User: User,
    Workspace: Workspace,
    injectMethods: function (that) {
      that.Application = Application;
      that.Attribute = Attribute;
      that.Command = Command;
      that.Delta = Delta;
      that.Interface = Interface;
      that.List = List;
      that.Log = Log;
      that.MemoryStore = MemoryStore;
      that.Message = Message;
      that.Model = Model;
      that.Presentation = Presentation;
      that.Procedure = Procedure;
      that.Request = Request;
      that.Store = Store;
      that.Session = Session;
      that.Transport = Transport;
      that.User = User;
      that.Workspace = Workspace;
    }
  };
};

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
/**
 * Simple functions
 */
Attribute.getTypes = function () {
  return ['ID', 'String', 'Date', 'Boolean', 'Number', 'Model', 'Group', 'Table', 'Object'].slice(0); // copy array
};
Attribute.getEvents = function () {
  return ['StateChange', 'Validate'].slice(0); // copy array
};
/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-command.source.js
 */
/**
 * Command Constructor
 */
function Command(args) {
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
    default:
      throw new TypeError();
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
/**
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
/**
 * Simple functions
 */
Command.getTypes = function () {
  return ['ID', 'String', 'Date', 'Boolean', 'Number', 'Model', 'Group', 'Table', 'Object'].slice(0); // copy array
};
Command.getEvents = function () {
  return ['BeforeExecute', 'AfterExecute', 'Error', 'Aborted', 'Completed'].slice(0); // copy array
};
/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-delta.source.js
 */
/**
 * Constructor
 */
function Delta(modelID) {
  if (false === (this instanceof Delta)) throw new Error('new operator required');
  if (false === (modelID instanceof Attribute.ModelID)) throw new Error('Attribute.ModelID required in constructor');
  this.dateCreated = new Date();
  this.modelID = modelID;
  this.attributeValues = {};
}

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-interface.source.js
 */
/**
 * Constructor
 */
function Interface(args) {
  if (false === (this instanceof Interface)) throw new Error('new operator required');
  args = args || {};
  args.name = args.name || '(unnamed)';
  args.description = args.description || 'a Interface';
  var i;
  var unusedProperties = getInvalidProperties(args, ['name', 'description']);
  var errorList = [];
  for (i = 0; i < unusedProperties.length; i++) errorList.push('invalid property: ' + unusedProperties[i]);
  if (errorList.length > 1)
    throw new Error('error creating Procedure: multiple errors');
  if (errorList.length) throw new Error('error creating Procedure: ' + errorList[0]);
  // default state
  this.startCallback = null;
  this.stopCallback = null;
  this.mocks = [];
  this.mockPending = false;
  // args ok, now copy to object
  for (i in args) this[i] = args[i];
}
/**
 * Methods
 */
Interface.prototype.toString = function () {
  return this.description;
};
Interface.prototype.canMock = function () {
  return false;
};
Interface.prototype.doMock = function () {
  // If no more elements then we are done
  this.mockPending = false;
  if (this.mocks.length < 1)
    return;
  // Get oldest ele and pass to callback if it is set
  var thisMock = this.mocks.shift();
  this.dispatch(thisMock);
  // Invoke for next element (delayed execution)
  this.mockPending = true;
  var self = this;
  setTimeout(function () {
    self.doMock();
  }, 0);
};
Interface.prototype.mockRequest = function (args) {
  if (!(args instanceof Array || args instanceof Request)) throw new Error('missing request parameter');
  if (!(args instanceof Array)) args = [args]; // coerce to array
  var i;
  for (i = 0; i < args.length; i++) {
    if (false === (args[i] instanceof Request)) throw new Error('invalid request parameter');
  }
  // All good stack them
  for (i = 0; i < args.length; i++) {
    this.mocks.push(args[i]);
  }
  // If mock is not pending then start it
  if (!this.mockPending) {
    this.doMock();
  }
};
Interface.prototype.start = function (application, presentation, callBack) {
  if (!(application instanceof Application)) throw new Error('Application required');
  if (!(presentation instanceof Presentation)) throw new Error('presentation required');
  if (typeof callBack != 'function') throw new Error('callBack required');
  this.application = application;
  this.presentation = presentation;
  this.startCallback = callBack;
};
Interface.prototype.stop = function (callBack) {
  if (typeof callBack != 'function') throw new Error('callBack required');
};
Interface.prototype.dispatch = function (request, response) {
  if (false === (request instanceof Request)) throw new Error('Request required');
  if (response && typeof response != 'function') throw new Error('response callback is not a function');
  if (!this.application || !this.application.dispatch(request)) {
    if (this.startCallback) {
      this.startCallback(request);
    }
  }
};
Interface.prototype.notify = function (request) {
  if (false === (request instanceof Request)) throw new Error('Request required');
};
Interface.prototype.render = function (presentation, callBack) {
  if (false === (presentation instanceof Presentation)) throw new Error('Presentation object required');
  if (callBack && typeof callBack != 'function') throw new Error('optional second argument must a commandRequest callback function');
};

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
 * tgi-core/lib/core/tgi-core-message.source.js
 */
/**
 * Constructor
 */
function Message(type, contents) {
  if (false === (this instanceof Message)) throw new Error('new operator required');
  if ('undefined' == typeof type) throw new Error('message type required');
  if (!contains(Message.getTypes(), type)) throw new Error('Invalid message type: ' + type);
  this.type = type;
  this.contents = contents;
}
/**
 * Methods
 */
Message.prototype.toString = function () {
  switch (this.type) {
    case 'Null':
      return this.type + ' Message';
    default:
      return this.type + ' Message: ' + this.contents;
  }
};
/**
 * Simple functions
 */
Message.getTypes = function () {
  return [
    'Null',
    'Connected',
    'Error',
    'Sent',
    'Ping',
    'PutModel',
    'PutModelAck',
    'GetModel',
    'GetModelAck',
    'DeleteModel',
    'DeleteModelAck',
    'GetList',
    'GetListAck'
  ].slice(0); // copy array
};

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core-procedure.source.js
 */
/**
 * Model Constructor
 */
var Procedure = function (args) {
  if (false === (this instanceof Procedure)) throw new Error('new operator required');
  args = args || {};
  var i;
  var unusedProperties = getInvalidProperties(args, ['tasks', 'tasksNeeded', 'tasksCompleted']);
  var errorList = [];
  for (i = 0; i < unusedProperties.length; i++) errorList.push('invalid property: ' + unusedProperties[i]);
  if (errorList.length > 1)
    throw new Error('error creating Procedure: multiple errors');
  if (errorList.length) throw new Error('error creating Procedure: ' + errorList[0]);
  // args ok, now copy to object and check for errors
  for (i in args)
    if (args.hasOwnProperty(i))
      this[i] = args[i];
  errorList = this.getObjectStateErrors(); // before leaving make sure valid Attribute
  if (errorList) {
    if (errorList.length > 1) throw new Error('error creating Procedure: multiple errors');
    if (errorList.length) throw new Error('error creating Procedure: ' + errorList[0]);
  }
};
Procedure.prototype.getObjectStateErrors = function () {
  var i, j, k;
  var unusedProperties;
  if (this.tasks && !(this.tasks instanceof Array)) return ['tasks is not an array'];
  var errorList = [];
  for (i in this.tasks) {
    if (this.tasks.hasOwnProperty(i)) {
      var task = this.tasks[i];
      unusedProperties = getInvalidProperties(task, ['label', 'command', 'requires', 'timeout']);
      for (j = 0; j < unusedProperties.length; j++) errorList.push('invalid task[' + i + '] property: ' + unusedProperties[j]);
      if (typeof task.label != 'undefined' && typeof task.label != 'string')
        errorList.push('task[' + i + '].label must be string');
      if (typeof task.command != 'undefined' && !(task.command instanceof Command))
        errorList.push('task[' + i + '].command must be a Command object');
      // make sure requires valid if specified
      if (typeof task.requires == 'undefined')
        task.requires = -1; // default to
      if (!(task.requires instanceof Array)) task.requires = [task.requires]; // coerce to array
      for (j in task.requires) {
        if (task.requires.hasOwnProperty(j) && task.requires[j] !== null)
          switch (typeof task.requires[j]) {
            case 'string':
              // make sure label exists
              var gotLabel = false;
              for (k=0; !gotLabel && k<this.tasks.length; k++ )
                if (task.requires[j] == this.tasks[k].label)
                  gotLabel = true;
              if (!gotLabel)
                throw new Error('missing label: ' + task.requires[j]);
              break;
            case 'number':
              if (task.requires[j] >= this.tasks.length) throw new Error('missing task #' + task.requires[j] + ' for requires in task[' + i + ']');
              if (task.requires[j] < -1) throw new Error('task #' + task.requires[j] + ' invalid requires in task[' + i + ']');
              break;
            default:
              throw new Error('invalid type for requires in task[' + i + ']');
          }
      }
    }
  }
  return errorList.length ? errorList : null;
};

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core-request.source.js
 */
/**
 * Constructor
 */
function Request(args) {
  if (false === (this instanceof Request)) throw new Error('new operator required');
  if (typeof args == 'string') {
    var quickType = args;
    args = {};
    args.type = quickType;
  }
  args = args || {};
  this.type = args.type || null;
  if (!this.type || typeof this.type != 'string') throw new Error('Request type required');
  switch (this.type) {
    case 'Command':
      this.command = args.command || null;
      if (!(this.command instanceof Command)) throw new Error('command object required');
      break;
  }
}
/**
 * Methods
 */
Request.prototype.toString = function () {
  switch (this.type) {
    case 'Command':
      return this.type + ' Request: ' + this.command;
    default:
      return this.type + ' Request';
  }
};

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core-store.source.js
 */

/**
 * Constructor
 */
var Store = function (args) {
  if (false === (this instanceof Store)) throw new Error('new operator required');
  args = args || {};
  this.storeType = args.storeType || "Store";
  this.name = args.name || 'a ' + this.storeType;
  this.storeProperty = {
    isReady: true,
    canGetModel: false,
    canPutModel: false,
    canDeleteModel: false,
    canGetList: false
  };
  var unusedProperties = getInvalidProperties(args, ['name', 'storeType']);
  var errorList = [];
  for (var i = 0; i < unusedProperties.length; i++) errorList.push('invalid property: ' + unusedProperties[i]);
  if (errorList.length > 1) throw new Error('error creating Store: multiple errors');
  if (errorList.length) throw new Error('error creating Store: ' + errorList[0]);
};
/**
 * Methods
 */
Store.prototype.toString = function () {
  if (this.name == 'a ' + this.storeType) {
    return this.name;
  } else {
    return this.storeType + ': ' +this.name;
  }
};
Store.prototype.getServices = function () {
  return this.storeProperty;
};
Store.prototype.onConnect = function (location, callBack) {
  if (typeof location != 'string') throw new Error('argument must a url string');
  if (typeof callBack != 'function') throw new Error('argument must a callback');
  callBack(this, undefined);
};
Store.prototype.getModel = function () {
  throw new Error(this.storeType + ' does not provide getModel');
};
Store.prototype.putModel = function () {
  throw new Error('Store does not provide putModel');
};
Store.prototype.deleteModel = function () {
  throw new Error('Store does not provide deleteModel');
};
Store.prototype.getList = function () {
  throw new Error('Store does not provide getList');
};

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core-transport.source.js
 */
/* istanbul ignore next */
function Transport(location, callBack) {
  if (false === (this instanceof Transport)) throw new Error('new operator required');
  if (typeof location != 'string') throw new Error('argument must a url string');
  if (typeof callBack != 'function') throw new Error('argument must a callback');
  var self = this;
  self.connected = false;
  self.initialConnect = true;
  self.location = location;
  if (self.location==='') self.location='http host';
  self.socket = io.connect(location);
  self.socket.on('connect', function () {
    self.connected = true;
    self.initialConnect = false;
    console.log('socket.io ('+self.location+') connected');
    callBack.call(self, new Message('Connected', ''));
  });
  self.socket.on('connecting', function () {
    console.log('socket.io ('+self.location+') connecting');
  });
  self.socket.on('error', function (reason) {
    var theReason = reason;
    if (theReason.length < 1) theReason = "(unknown)";
    console.error('socket.io ('+self.location+') error: ' + theReason + '.');
    // If have not ever connected then signal error
    if (self.initialConnect) {
      callBack.call(self, new Message('Error', 'cannot connect'));
    }
  });
  self.socket.on('connect_failed', function (reason) {
    var theReason = reason;
    if (theReason.length < 1) theReason = "(unknown)";
    console.error('socket.io ('+self.location+') connect_failed: ' + theReason + '.');
    // If have not ever connected then signal error
    if (self.initialConnect) {
      callBack.call(self, new Message('Error', 'cannot connect'));
    }
  });
  self.socket.on('message', function (obj) {
    console.log('socket.io ('+self.location+') message: ' + obj);
  });
  self.socket.on('disconnect', function (reason) {
    self.connected = false;
    console.log('socket.io ('+self.location+') disconnect: ' + reason);
  });
}
/*
 * Methods
 */
/* istanbul ignore next */
Transport.prototype.send = function (message, callBack) {
  var self = this;
  if (typeof message == 'undefined') throw new Error('message required');
  if (!(message instanceof Message)) throw new Error('parameter must be instance of Message');
  if (typeof callBack != 'undefined' && typeof callBack != 'function') throw new Error('argument must a callback');
  if (!this.connected) {
    callBack.call(self, new Message('Error', 'not connected'));
    return;
  }
  if (typeof callBack != 'undefined') {
    self.socket.emit('ackmessage', message, function (msg) {
      callBack.call(self, msg);
    });
  } else {
    self.socket.send(message);
  }
};
/* istanbul ignore next */
Transport.prototype.close = function () {
  if (!this.connected)
    throw new Error('not connected');
  this.socket.disconnect();
};

/**
 * tequila
 * application-model
 */

// Model Constructor
var Application = function (args) {
  if (false === (this instanceof Application)) throw new Error('new operator required');
  args = args || {};
  if (!args.attributes) {
    args.attributes = [];
  }
  args.attributes.push(new Attribute({name: 'name', type: 'String(20)'}));
  args.attributes.push(new Attribute({name: 'brand', type: 'String'}));
  Model.call(this, args);
  this.modelType = "Application";
  this.set('name','newApp');
  this.set('brand','NEW APP');
};
Application.prototype = Object.create(Model.prototype);
/*
 * Methods
 */
Application.prototype.start = function (callBack) {
  if (false === (this.primaryInterface instanceof Interface)) throw new Error('error starting application: interface not set');
  if (typeof callBack != 'function') throw new Error('callBack required');
  var self = this;
  this.startCallback = callBack;
  this.primaryInterface.start(self, this.presentation, this.sysPresentation, function (request) {
    if (request.type=='Command') {
      request.command.execute();
    } else {
      if (self.startCallback) {
        self.startCallback(request);
      }
    }
  });
};
Application.prototype.dispatch = function (request, response) {
  if (false === (request instanceof Request)) throw new Error('Request required');
  if (response && typeof response != 'function') throw new Error('response callback is not a function');
  if (this.startCallback) {
    this.startCallback(request);
    return true;
  }
  return false;
};
Application.prototype.setInterface = function (primaryInterface) {
  if (false === (primaryInterface instanceof Interface)) throw new Error('instance of Interface a required parameter');
  this.primaryInterface = primaryInterface;
};
Application.prototype.getInterface = function () {
  return this.primaryInterface;
};
Application.prototype.setPresentation = function (presentation) {
  if (false === (presentation instanceof Presentation)) throw new Error('instance of Presentation a required parameter');
  this.presentation = presentation;
  if (this.startCallback) {
    // Interface started so reload
    this.primaryInterface.setPresentation(this.presentation);
  }
};
Application.prototype.getPresentation = function () {
  return this.presentation;
};
/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/models/tgi-core-model-log.source.js
 */

/**
 * Constructor
 */
var Log = function (args) {
  if (false === (this instanceof Log)) throw new Error('new operator required');
  if (typeof args == 'string') {
    var simpleText = args;
    args = {};
    args.contents = simpleText;
  }
  args = args || {};
  if (!args.attributes) {
    args.attributes = [];
  }
  var my_logType = args.logType || 'Text';
  var my_importance = args.importance || 'Info';
  var my_contents = args.contents || '(no text)';
  if (!contains(['Text', 'Delta'], my_logType)) throw new Error('Unknown log type: ' + my_logType);
  if (typeof args.logType != 'undefined') delete args.logType;
  if (typeof args.importance != 'undefined') delete args.importance;
  if (typeof args.contents != 'undefined') delete args.contents;
  args.attributes.push(new Attribute({name: 'dateLogged', type: 'Date', value: new Date()}));
  args.attributes.push(new Attribute({name: 'logType', type: 'String', value: my_logType}));
  args.attributes.push(new Attribute({name: 'importance', type: 'String', value: my_importance}));
  if (my_logType == 'Delta')
    args.attributes.push(new Attribute({name: 'contents', type: 'Object', value: my_contents}));
  else
    args.attributes.push(new Attribute({name: 'contents', type: 'String', value: my_contents}));
  Model.call(this, args);
  this.modelType = "Log";
};
Log.prototype = Object.create(Model.prototype);
/**
 * Methods
 */
Log.prototype.toString = function () {
  if (this.get('logType') == 'Delta')
    return this.get('importance') + ': ' + '(delta)';
  else
    return this.get('importance') + ': ' + this.get('contents');
};

/**
 * tequila
 * presentation-model
 */
// Model Constructor
var Presentation = function (args) {
  if (false === (this instanceof Presentation)) throw new Error('new operator required');
  args = args || {};
  if (!args.attributes) {
    args.attributes = [];
  }
  args.attributes.push(new Attribute({name: 'name', type: 'String'}));
  args.attributes.push(new Attribute({name: 'modelName', type: 'String'}));
  args.attributes.push(new Attribute({name: 'contents', type: 'Object', value: []}));
  Model.call(this, args);
  this.modelType = "Presentation";
};
Presentation.prototype = Object.create(Model.prototype);
/*
 * Methods
 */
Presentation.prototype.getObjectStateErrors = function (modelCheckOnly) {
  var i;
  this.validationErrors = Model.prototype.getObjectStateErrors.call(this);
  if (!modelCheckOnly && this.validationErrors.length === 0) { // Only check if model it valid
    var contents = this.get('contents');
    var gotError = false;
    if (contents instanceof Array) {
      for (i = 0; i < contents.length; i++) {
        if (!(contents[i] instanceof Command || contents[i] instanceof Attribute || typeof contents[i] == 'string'))
          gotError = true;
      }
      if (gotError)
        this.validationErrors.push('contents elements must be Command, Attribute or string');
    } else {
      this.validationErrors.push('contents must be Array');
    }
  }
  this.validationMessage = this.validationErrors.length > 0 ? this.validationErrors[0] : '';
  return this.validationErrors;
};
Presentation.prototype.validate = function (callBack) {
  var presentation = this;
  if (typeof callBack != 'function') throw new Error('callback is required');
  this.getObjectStateErrors();
  var e;
  for (e in this._errorConditions) {
    if (this._errorConditions.hasOwnProperty(e)) {
      this.validationErrors.push(this._errorConditions[e]);
    }
  }
  // validate each attribute in contents
  var i;
  var gotError = false;
  var attributeCount = 0;
  var checkCount = 0;
  var contents = this.get('contents');
  if (contents instanceof Array) {
    // Count first
    for (i = 0; i < contents.length; i++) {
      if (contents[i] instanceof Attribute) {
        attributeCount++;
      }
    }
    // Launch validations
    for (i = 0; i < contents.length; i++) {
      if (contents[i] instanceof Attribute) {
        contents[i].validate(checkAttrib);
      }
    }
  }
  function checkAttrib() {
    checkCount++;
    // this is the attribute TODO this bad usage ?
    if (this.validationMessage) // jshint ignore:line
      gotError = true;
    if (checkCount==checkCount) {
      if (gotError)
        presentation.validationErrors.push('contents has validation errors');
      presentation.validationMessage = presentation.validationErrors.length > 0 ? presentation.validationErrors[0] : '';
      callBack();
    }
  }
};

/**
 * tequila
 * session-model
 */
// Model Constructor
var Session = function (args) {
  if (false === (this instanceof Session)) throw new Error('new operator required');
  args = args || {};
  if (!args.attributes) {
    args.attributes = [];
  }
  var userModelID = new Attribute.ModelID(new User());
  args.attributes.push(new Attribute({name: 'userID', type: 'Model', value: userModelID}));
  args.attributes.push(new Attribute({name: 'dateStarted', type: 'Date', value: new Date()}));
  args.attributes.push(new Attribute({name: 'passCode', type: 'String(20)'}));
  args.attributes.push(new Attribute({name: 'active', type: 'Boolean'}));
  args.attributes.push(new Attribute({name: 'ipAddress', type: 'String'}));

  Model.call(this, args);
  this.modelType = "Session";
  this.set('active', false);
};
Session.prototype = Object.create(Model.prototype);
/*
 * Methods
 */
Session.prototype.startSession = function (store, userName, password, ip, callBack) {
  if (false === (store instanceof Store)) throw new Error('store required');
  if (typeof userName !== 'string') throw new Error('userName required');
  if (typeof password !== 'string') throw new Error('password required');
  if (typeof ip !== 'string') throw new Error('ip required');
  if (typeof callBack != 'function') throw new Error('callBack required');

  // Find user in store
  var self = this;
  var userModel = new User();
  store.getList(new List(userModel), {name: userName, password: password}, function (list, error) {
    if (error) {
      callBack(error);
      return;
    }
    if (list.length() != 1) {
      callBack(new Error('login not found'));
      return;
    }

    // Make random passCode
    var passCode = "";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 20; i++)
      passCode += chars.charAt(Math.floor(Math.random() * chars.length));

    // Got user create new session
    // TODO: Make this server side tied to yet to be designed store integrated authentication
    list.moveFirst();
    self.set('userID', list.get('id'));
    self.set('active', true);
    self.set('passCode', passCode);
    self.set('ipAddress', ip);
    store.putModel(self, function (model, error) {
      callBack(error, model);
    });
  });
};
Session.prototype.resumeSession = function (store, ip, passCode, callBack) {
  if (false === (store instanceof Store)) throw new Error('store required');
  if (typeof ip !== 'string') throw new Error('ip required');
  if (typeof passCode !== 'string') throw new Error('passCode required');
  if (typeof callBack != 'function') throw new Error('callBack required');

  // Find the session in store
  var self = this;
  store.getList(new List(self), {ipAddress: ip, passCode: passCode}, function (list, error) {
    if (error) {
      callBack(error);
      return;
    }
    if (list.length() != 1) {
      callBack(new Error('session not resumed'));
      return;
    }

    // Get model for session as shitty as this is (TODO a better way)
    list.moveFirst();
    self.set('id', list.get('id'));
    self.set('userID', list.get('userID'));
    self.set('dateStarted', list.get('dateStarted'));
    self.set('passCode', list.get('passCode'));
    self.set('active', list.get('active'));
    self.set('ipAddress', list.get('ipAddress'));
    callBack(error, self);
  });

};
Session.prototype.endSession = function (store, callBack) {
  if (false === (store instanceof Store)) throw new Error('store required');
  if (typeof callBack != 'function') throw new Error('callBack required');

  // If no session ID (never persisted) or is not active then silently return
  if (!this.get('active') || !this.get('id')) {
    callBack(this);
  }
  // Mark inactive and save to store
  this.set('active', false);
  store.putModel(this, function (model, err) {
    callBack(err, model);
  });
};
/**
 * tequila
 * user-core-model
 */
// Model Constructor
var User = function (args) {
  if (false === (this instanceof User)) throw new Error('new operator required');
  args = args || {};
  if (!args.attributes) {
    args.attributes = [];
  }
  args.attributes.push(new Attribute({name: 'name', type: 'String(20)'}));
  args.attributes.push(new Attribute({name: 'active', type: 'Boolean'}));
  args.attributes.push(new Attribute({name: 'password', type: 'String(20)'}));
  args.attributes.push(new Attribute({name: 'firstName', type: 'String(35)'}));
  args.attributes.push(new Attribute({name: 'lastName', type: 'String(35)'}));
  args.attributes.push(new Attribute({name: 'email', type: 'String(20)'}));
  Model.call(this, args);
  this.modelType = "User";
  this.set('active',false);
};
User.prototype = Object.create(Model.prototype);
/**
 * tequila
 * workspace-class
 */
function Workspace(args) {
  if (false === (this instanceof Workspace)) throw new Error('new operator required');
  args = args || {};
  if (!args.attributes) {
    args.attributes = [];
  }
  var userModelID = new Attribute.ModelID(new User());
  args.attributes.push(new Attribute({name: 'user', type: 'Model', value: userModelID}));
  args.attributes.push(new Attribute({name: 'deltas', type: 'Object', value: {}}));

//  var delta
//  this.deltas = [];

  Model.call(this, args);
  this.modelType = "Workspace";
}
Workspace.prototype = Object.create(Model.prototype);
/*
 * Methods
 */


/**
 * tequila
 * memory-store
 */
// Constructor
var MemoryStore = function (args) {
  if (false === (this instanceof MemoryStore)) throw new Error('new operator required');
  args = args || {};
  this.storeType = args.storeType || "MemoryStore";
  this.name = args.name || 'a ' + this.storeType;
  this.storeProperty = {
    isReady: true,
    canGetModel: true,
    canPutModel: true,
    canDeleteModel: true,
    canGetList: true
  };
  this.data = [];// Each ele is an array of model types and contents (which is an array of IDs and Model Value Store)
  this.idCounter = 0;
  var unusedProperties = getInvalidProperties(args, ['name', 'storeType']);
  var errorList = [];
  for (var i = 0; i < unusedProperties.length; i++) errorList.push('invalid property: ' + unusedProperties[i]);
  if (errorList.length > 1) throw new Error('error creating Store: multiple errors');
  if (errorList.length) throw new Error('error creating Store: ' + errorList[0]);
};
MemoryStore.prototype = Object.create(Store.prototype);
// Methods
MemoryStore.prototype.getModel = function (model, callBack) {
  var i, a;
  if (!(model instanceof Model)) throw new Error('argument must be a Model');
  if (model.getObjectStateErrors().length) throw new Error('model has validation errors');
  if (!model.attributes[0].value) throw new Error('ID not set');
  if (typeof callBack != "function") throw new Error('callBack required');
  // Find model in memorystore, error out if can't find
  var modelIndex = -1;
  for (i = 0; i < this.data.length; i++) if (this.data[i][0] == model.modelType) modelIndex = i;
  if (modelIndex < 0) {
    callBack(model, new Error('model not found in store'));
    return;
  }
  // Find the ID now and put in instanceIndex
  var id = model.get('id');
  var storedPair = this.data[modelIndex][1];
  var instanceIndex = -1;
  for (i = 0; instanceIndex < 0 && i < storedPair.length; i++) if (storedPair[i][0] == id) instanceIndex = i;
  if (instanceIndex < 0) {
    callBack(model, new Error('id not found in store'));
    return;
  }
  // Copy values from store to ref model
  var storeValues = storedPair[instanceIndex][1];
  for (a in model.attributes) {
    model.attributes[a].value = storeValues[model.attributes[a].name];
  }
  callBack(model, undefined);
};
MemoryStore.prototype.putModel = function (model, callBack) {
  var i, a, id, modelIndex, ModelValues, theName, theValue;

  if (!(model instanceof Model)) throw new Error('argument must be a Model');
  if (model.getObjectStateErrors().length) throw new Error('model has validation errors');
  if (typeof callBack != "function") throw new Error('callBack required');
  id = model.get('ID');
  if (id) {
    // Find model in memorystore, error out if can't find
    modelIndex = -1;
    for (i = 0; i < this.data.length; i++) if (this.data[i][0] == model.modelType) modelIndex = i;
    if (modelIndex < 0) {
      callBack(model, new Error('model not found in store'));
      return;
    }
    // Find the ID now
    var instanceIndex = -1;
    id = model.get('id');
    var storedPair = this.data[modelIndex][1];
    for (i = 0; instanceIndex < 0 && i < storedPair.length; i++) if (storedPair[i][0] == id) instanceIndex = i;
    if (instanceIndex < 0) {
      callBack(model, new Error('id not found in store'));
      return;
    }
    // Copy from store
    ModelValues = {};
    for (a in model.attributes) {
      theName = model.attributes[a].name;
      theValue = model.attributes[a].value;
      ModelValues[theName] = theValue;
    }
    storedPair[instanceIndex][1] = ModelValues;
    callBack(model, undefined);
  } else {
    // Find model in memorystore, add if not found
    modelIndex = -1;
    for (i = 0; i < this.data.length; i++) if (this.data[i][0] == model.modelType) modelIndex = i;
    if (modelIndex < 0) {
      this.data.push([model.modelType, []]);
      modelIndex = this.data.length - 1;
    }
    // Add the id and model to memory store
    var newID = ++this.idCounter;
    model.set('id', newID);
    ModelValues = {};
    for (a in model.attributes) {
      theName = model.attributes[a].name;
      theValue = model.attributes[a].value;
      ModelValues[theName] = theValue;
    }
    this.data[modelIndex][1].push([newID, ModelValues]);
    callBack(model, undefined);
  }

};
MemoryStore.prototype.deleteModel = function (model, callBack) {
  var i, a;
  if (!(model instanceof Model)) throw new Error('argument must be a Model');
  if (model.getObjectStateErrors().length) throw new Error('model has validation errors');
  if (typeof callBack != "function") throw new Error('callBack required');
  // Find model in memorystore, error out if can't find
  var modelIndex = -1;
  for (i = 0; i < this.data.length; i++) if (this.data[i][0] == model.modelType) modelIndex = i;
  if (modelIndex < 0) {
    callBack(model, new Error('model not found in store'));
    return;
  }
  // Find the ID now
  var instanceIndex = -1;
  var id = model.get('id');
  var storedPair = this.data[modelIndex][1];
  for (i = 0; instanceIndex < 0 && i < storedPair.length; i++) if (storedPair[i][0] == id) instanceIndex = i;
  if (instanceIndex < 0) {
    callBack(model, new Error('id not found in store'));
    return;
  }
  // Splice out the stored values then prepare that Model for callback with ID stripped
  var storeValues = storedPair.splice(instanceIndex, 1)[0][1];
  for (a in model.attributes) {
    if (model.attributes[a].name == 'id')
      model.attributes[a].value = undefined;
    else
      model.attributes[a].value = storeValues[model.attributes[a].name];
  }
  callBack(model, undefined);
};
MemoryStore.prototype.getList = function (list, filter, arg3, arg4) {
  var callBack, order, i;
  if (typeof(arg4) == 'function') {
    callBack = arg4;
    order = arg3;
  } else {
    callBack = arg3;
  }
  if (!(list instanceof List)) throw new Error('argument must be a List');
  if (!(filter instanceof Object)) throw new Error('filter argument must be Object');
  if (typeof callBack != "function") throw new Error('callBack required');
  // Find model in memorystore, error out if can't find
  var modelIndex = -1;
  for (i = 0; i < this.data.length; i++) if (this.data[i][0] == list.model.modelType) modelIndex = i;
  if (modelIndex < 0) {
    callBack(list);
    return;
  }
  list.clear();
  var storedPair = this.data[modelIndex][1];
//  console.log('// storedPair\n' + JSON.stringify(storedPair,null,2));
  for (i = 0; i < storedPair.length; i++) {
    var doIt = true;
    for (var prop in filter) {
      if (filter.hasOwnProperty(prop)) {
        if (filter[prop] instanceof RegExp) {
          if (!filter[prop].test(storedPair[i][1][prop])) doIt = false;
        } else {
          if (filter[prop] != storedPair[i][1][prop]) doIt = false;
        }
      }
    }
    if (doIt) {
      var dataPart = [];
      for (var j in storedPair[i][1]) {
        dataPart.push(storedPair[i][1][j]);
      }
      list._items.push(dataPart);
    }
  }
  list._itemIndex = list._items.length - 1;
  if (order) {
    list.sort(order);
  }
//  console.log(JSON.stringify(list,null,2));
  callBack(list);
};
