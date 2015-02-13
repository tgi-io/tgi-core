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
  args.vendor = args.vendor || null;
  var i;
  var unusedProperties = getInvalidProperties(args, ['name', 'description', 'vendor']);
  var errorList = [];
  for (i = 0; i < unusedProperties.length; i++) errorList.push('invalid property: ' + unusedProperties[i]);
  if (errorList.length > 1)
    throw new Error('error creating Interface: multiple errors');
  if (errorList.length) throw new Error('error creating Interface: ' + errorList[0]);
  // default state
  this.startcallback = null;
  this.stopcallback = null;
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
  return true;
};
Interface.prototype.doMock = function () {
  var callback;
  // If no more elements then we are done
  this.mockPending = false;
  if (this.mocks.length < 1)
    return;
  // Get oldest ele and pass to callback if it is set
  var thisMock = this.mocks.shift();
  if (thisMock.type == 'ok') {
    if (this.okcallback) {
      callback = this.okcallback;
      delete this.okcallback;
      callback();
    } else {
      this.okPending = true;
    }
    return;
  }
  if (thisMock.type == 'yes' || thisMock.type == 'no') {
    if (this.yesnocallback) {
      callback = this.yesnocallback;
      delete this.yesnocallback;
      callback(thisMock.type == 'yes');
    } else {
      this.yesnoPending = true;
      this.yesnoResponse = (thisMock.type == 'yes');
    }
    return;
  }
  if (thisMock.type == 'ask') {
    if (this.askcallback) {
      callback = this.askcallback;
      delete this.askcallback;
      callback(thisMock.value);
    } else {
      this.askPending = true;
      this.askResponse = thisMock.value;
    }
    return;
  }
  if (thisMock.type == 'choose') {
    if (this.choosecallback) {
      callback = this.choosecallback;
      delete this.choosecallback;
      callback(Interface.firstMatch(thisMock.value, this.chooseChoices));
    } else {
      this.choosePending = true;
      this.chooseResponse = thisMock.value;
    }
    return;
  }
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
Interface.prototype.start = function (application, presentation, callback) {
  if (!(application instanceof Application)) throw new Error('Application required');
  if (!(presentation instanceof Presentation)) throw new Error('presentation required');
  if (typeof callback != 'function') throw new Error('callback required');
  this.application = application;
  this.presentation = presentation;
  this.startcallback = callback;
};
Interface.prototype.stop = function (callback) {
  if (typeof callback != 'function') throw new Error('callback required');
};
Interface.prototype.dispatch = function (request, response) {
  if (false === (request instanceof Request)) throw new Error('Request required');
  if (response && typeof response != 'function') throw new Error('response callback is not a function');
  if (!this.application || !this.application.dispatch(request)) {
    if (this.startcallback) {
      this.startcallback(request);
    }
  }
};
Interface.prototype.notify = function (message) {
  if (false === (message instanceof Message)) throw new Error('Message required');
};
Interface.prototype.render = function (presentation, callback) {
  if (false === (presentation instanceof Presentation)) throw new Error('Presentation object required');
  if (callback && typeof callback != 'function') throw new Error('optional second argument must a commandRequest callback function');
};
Interface.prototype.info = function (text) {
  if (!text || typeof text !== 'string') throw new Error('text required');
};
Interface.prototype.ok = function (prompt, callback) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (typeof callback != 'function') throw new Error('callback required');
  if (this.okPending) {
    delete this.okPending;
    callback();
  } else {
    this.okcallback = callback;
  }
};
Interface.prototype.yesno = function (prompt, callback) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (typeof callback != 'function') throw new Error('callback required');
  if (this.yesnoPending) {
    delete this.yesnoPending;
    callback(this.yesnoResponse);
  } else {
    this.yesnocallback = callback;
  }
};
Interface.prototype.ask = function (prompt, attribute, callback) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (false === (attribute instanceof Attribute)) throw new Error('attribute or callback expected');
  if (typeof callback != 'function') throw new Error('callback required');
  if (this.askPending) {
    delete this.askPending;
    callback(this.askResponse);
  } else {
    this.askcallback = callback;
  }
};
Interface.prototype.choose = function (prompt, choices, callback) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (false === (choices instanceof Array)) throw new Error('choices array required');
  if (!choices.length) throw new Error('choices array empty');
  if (typeof callback != 'function') throw new Error('callback required');
  if (this.choosePending) {
    delete this.choosePending;
    callback(Interface.firstMatch(this.chooseResponse, choices));
  } else {
    this.choosecallback = callback;
    this.chooseChoices = choices;
  }
};
/**
 * Helper Functions
 */
Interface.firstMatch = function (s, a) { // find first partial match with s in array a
  if (undefined === s)
  return undefined;
  for (var i = 0; i < a.length; i++) {
    var obj = a[i].toLowerCase();
    if (left(obj, s.length) == s.toLowerCase())
      return i;
  }
  return undefined;
};