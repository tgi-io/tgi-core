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
    ['name', 'description', 'type', 'contents', 'scope', 'timeout', 'theme', 'icon', 'bucket', 'presentationMode','location','images']);
  var errorList = [];
  for (i = 0; i < unusedProperties.length; i++) errorList.push('invalid property: ' + unusedProperties[i]);
  if (errorList.length > 1) throw new Error('error creating Command: multiple errors');
  if (errorList.length) throw new Error('error creating Command: ' + errorList[0]);
  for (i in args) this[i] = args[i];
  this.name = this.name || "a command"; // name is optional
  if ('string' != typeof this.name) throw new Error('name must be string');
  if ('undefined' == typeof this.description) this.description = this.name + ' Command';
  if ('undefined' == typeof this.type) this.type = 'Stub';
  if (!contains(Command.getTypes(), this.type)) throw new Error('Invalid command type: ' + this.type);
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
      this.presentationMode = this.presentationMode || 'View';
      if (!contains(Command.getPresentationModes(), this.presentationMode)) throw new Error('Invalid presentationMode: ' + this.presentationMode);
      //['View', 'Edit', 'List']
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
Command.prototype._emitEvent = function (event, obj) {
  var i;
  for (i in this._eventListeners) {
    if (this._eventListeners.hasOwnProperty(i)) {
      var subscriber = this._eventListeners[i];
      if ((subscriber.events.length && subscriber.events[0] === '*') || contains(subscriber.events, event)) {
        subscriber.callback.call(this, event, obj);
      }
    }
  }
  //if (event == 'Completed') // if command complete release listeners
  //  this._eventListeners = [];
};
Command.prototype.execute = function (context) {
  var command = this;
  var args = arguments;
  if (!command.type) throw new Error('command not implemented');
  if (!contains(['Function', 'Procedure', 'Menu', 'Presentation'], command.type)) throw new Error('command type ' + command.type + ' not implemented');
  var errors;
  switch (command.type) {
    case 'Presentation':
      if (!(command.contents instanceof Presentation)) throw new Error('contents must be a Presentation');
      errors = command.contents.getObjectStateErrors();
      if (errors.length) {
        if (errors.length > 1)
          throw new Error('error executing Presentation: multiple errors');
        else
          throw new Error('error executing Presentation: ' + errors[0]);
      }
      if (!(context instanceof Interface)) throw new Error('interface param required');
      break;
  }

  command._emitEvent('BeforeExecute');
  try {
    switch (command.type) {
      case 'Function':
        setTimeout(callFunc, 0);
        break;
      case 'Procedure':
        setTimeout(procedureExecuteInit, 0);
        break;
      case 'Menu':
        context.render(command, 'View');
        break;
      case 'Presentation':
        if (command.contents.preRenderCallback) {
          command.contents.preRenderCallback(command, function () {
            context.render(command);
          });
        } else {
          context.render(command);  
        }
        break;
    }
  } catch (e) {
    command.error = e;
    command._emitEvent('Error', e);
    command._emitEvent('Completed');
    command.status = -1;
  }
  command._emitEvent('AfterExecute');
  
  function callFunc() {
    command.status = 0;
    try {
      command.contents.apply(command, args); // give function this context to command object (command)
    } catch (e) {
      command.error = e;
      command._emitEvent('Error', e);
      command._emitEvent('Completed');
      command.status = -1;
    }
  }

  function procedureExecuteInit() {
    command.status = 0;
    var tasks = command.contents.tasks || [];
    for (var t = 0; t < tasks.length; t++) {
      // shorthand for function command gets coerced into longhand
      if (typeof tasks[t] == 'function') {
        var theFunc = tasks[t];
        tasks[t] = {requires: [-1], command: new Command({type: 'Function', contents: theFunc})};
      }
      // Initialize if not done
      if (!tasks[t].command._parentProcedure) {
        tasks[t].command._taskIndex = t;
        tasks[t].command._parentProcedure = command;
        tasks[t].command.onEvent('*', ProcedureEvents);
      }
      tasks[t].command.status = undefined;
    }
    procedureExecute();
  }

  function procedureExecute() {
    var tasks = command.contents.tasks || [];
    for (var t = 0; t < tasks.length; t++) {
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

  function ProcedureEvents(event, obj) {
    var tasks = command.contents.tasks;
    var allTasksDone = true; // until proved wrong ...
    switch (event) {
      case 'Error':
        command._emitEvent('Error', obj);
        break;
      case 'Aborted':
        command.abort();
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
          command.complete(); // todo when all run
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
Command.prototype.restart = function () {
  this.status = undefined;
  this._emitEvent('Restarted');
  this.execute();
};
/**
 * Simple functions
 */
Command.getTypes = function () {
  return ['Stub', 'Menu', 'Presentation', 'Function', 'Procedure'].slice(0); // copy array
};
Command.getEvents = function () {
  return ['BeforeExecute', 'AfterExecute', 'Error', 'Aborted', 'Completed'].slice(0); // copy array
};
Command.getPresentationModes = function () {
  return ['View', 'Edit', 'List'].slice(0); // copy array
};