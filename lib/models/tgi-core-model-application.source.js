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
  if (!this.presentation) this.presentation = new Presentation();
  this.primaryInterface.start(self, this.presentation, function (request) {
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
Application.prototype.yesno = function (prompt, callBack) {
  if (false === (this.primaryInterface instanceof Interface)) throw new Error('interface not set');
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (typeof callBack != 'function') throw new Error('callBack required');
};
Application.prototype.ok = function (prompt, callBack) {
  if (false === (this.primaryInterface instanceof Interface)) throw new Error('interface not set');
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (typeof callBack != 'function') throw new Error('callBack required');
};
Application.prototype.ask = function (prompt, attribute, callBack) {
  if (false === (this.primaryInterface instanceof Interface)) throw new Error('interface not set');
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (false === (attribute instanceof Attribute)) throw new Error('instance of Attribute a required parameter');
  if (typeof callBack != 'function') throw new Error('callBack required');
};
Application.prototype.choose = function (prompt, choices, callBack) {
  if (false === (this.primaryInterface instanceof Interface)) throw new Error('interface not set');
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (false === (choices instanceof Array)) throw new Error('choices array required');
  if (!choices.length) throw new Error('choices array empty');
  if (typeof callBack != 'function') throw new Error('callBack required');
};
