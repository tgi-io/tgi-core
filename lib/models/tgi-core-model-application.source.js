/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core-model-application.source.js
 */

/**
 * Constructor Function
 */
var Application = function (args) {
  var _interface;
  if (false === (this instanceof Application)) throw new Error('new operator required');
  args = args || {};
  if (!args.attributes) {
    args.attributes = [];
  }
  args.attributes.push(new Attribute({name: 'name', type: 'String(20)'}));
  args.attributes.push(new Attribute({name: 'brand', type: 'String'}));
  if (args.interface) {
    this.setInterface(args.interface);
    delete args.interface;
  }
  Model.call(this, args);
  this.modelType = "Application";
  this.set('name', 'newApp');
  this.set('brand', 'NEW APP');
};
Application.prototype = Object.create(Model.prototype);
Model._ModelConstructor.Application = Application;


/**
 * Methods
 */
Application.prototype.start = function (callback) {
  if (false === (this.primaryInterface instanceof Interface)) throw new Error('error starting application: interface not set');
  if (typeof callback != 'function') throw new Error('callback required');
  var self = this;
  this.startcallback = callback;
  if (!this.presentation) this.presentation = new Presentation();
  this.primaryInterface.start(self, this.presentation, function (request) {
    if (request.type == 'Command') {
      request.command.execute();
    } else {
      if (self.startcallback) {
        self.startcallback(request);
      }
    }
  });
};
Application.prototype.dispatch = function (request, response) {
  if (false === (request instanceof Request)) throw new Error('Request required');
  if (response && typeof response != 'function') throw new Error('response callback is not a function');
  // commands are handled directly
  if (request.type == 'Command') {
    request.command.execute();
    return true;
  } else {
    if (this.startcallback) {
      this.startcallback(request);
      return true;
    }
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
  //if (this.startcallback) { TODO WTF
  //  // Interface started so reload
  //  this.primaryInterface.setPresentation(this.presentation);
  //}
};
Application.prototype.getPresentation = function () {
  return this.presentation;
};
Application.prototype.info = function (text) {
  if (false === (this.primaryInterface instanceof Interface)) throw new Error('interface not set');
  if (!text || typeof text !== 'string') throw new Error('text parameter required');
  this.primaryInterface.info(text);
};
Application.prototype.warn = function (text) {
  if (false === (this.primaryInterface instanceof Interface)) throw new Error('interface not set');
  if (!text || typeof text !== 'string') throw new Error('text parameter required');
  this.primaryInterface.warn(text);
};
Application.prototype.err = function (text) {
  if (false === (this.primaryInterface instanceof Interface)) throw new Error('interface not set');
  if (!text || typeof text !== 'string') throw new Error('text parameter required');
  this.primaryInterface.err(text);
};
Application.prototype.ok = function (prompt, callback) {
  if (false === (this.primaryInterface instanceof Interface)) throw new Error('interface not set');
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (typeof callback != 'function') throw new Error('callback required');
  this.primaryInterface.ok(prompt, callback);
};
Application.prototype.yesno = function (prompt, callback) {
  if (false === (this.primaryInterface instanceof Interface)) throw new Error('interface not set');
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (typeof callback != 'function') throw new Error('callback required');
  this.primaryInterface.yesno(prompt, callback);
};
Application.prototype.ask = function (prompt, attribute, callback) {
  if (false === (this.primaryInterface instanceof Interface)) throw new Error('interface not set');
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (typeof attribute == 'function') {
    this.primaryInterface.ask(prompt, new Attribute({name: 'default'}), attribute);
    return;
  }
  if (false === (attribute instanceof Attribute)) throw new Error('attribute or callback expected');
  if (typeof callback != 'function') throw new Error('callback required');
  this.primaryInterface.ask(prompt, attribute, callback);
};
Application.prototype.choose = function (prompt, choices, callback) {
  if (false === (this.primaryInterface instanceof Interface)) throw new Error('interface not set');
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (false === (choices instanceof Array)) throw new Error('choices array required');
  if (!choices.length) throw new Error('choices array empty');
  if (typeof callback != 'function') throw new Error('callback required');
  this.primaryInterface.choose(prompt, choices, callback);
};
