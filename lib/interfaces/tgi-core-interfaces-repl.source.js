/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/interfaces/tgi-core-interfaces-repl.source.js
 */
/**
 * Constructor
 */
var REPLInterface = function (args) {
  if (false === (this instanceof Interface)) throw new Error('new operator required');
  args = args || {};
  args.name = args.name || '(unnamed)';
  args.description = args.description || 'a REPLInterface';
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
};
REPLInterface.prototype = Object.create(Interface.prototype);
/**
 * Methods
 */
REPLInterface.prototype.toString = function () {
  return this.description;
};
REPLInterface.prototype.canMock = function () {
  return true;
};
REPLInterface.prototype.doMock = function () {
  var callBack;
  // If no more elements then we are done
  this.mockPending = false;
  if (this.mocks.length < 1)
    return;
  // Get oldest ele and pass to callback if it is set
  var thisMock = this.mocks.shift();
  if (thisMock.type == 'ok') {
    if (this.okCallBack) {
      callBack = this.okCallBack;
      delete this.okCallBack;
      callBack();
    } else {
      this.okPending = true;
    }
    return;
  }
  if (thisMock.type == 'yes' || thisMock.type == 'no') {
    if (this.yesnoCallBack) {
      callBack = this.yesnoCallBack;
      delete this.yesnoCallBack;
      callBack(thisMock.type == 'yes');
    } else {
      this.yesnoPending = true;
      this.yesnoResponse = (thisMock.type == 'yes');
    }
    return;
  }
  if (thisMock.type == 'ask') {
    if (this.askCallBack) {
      callBack = this.askCallBack;
      delete this.askCallBack;
      callBack(thisMock.value);
    } else {
      this.askPending = true;
      this.askResponse = thisMock.value;
    }
    return;
  }
  if (thisMock.type == 'choose') {
    if (this.chooseCallBack) {
      callBack = this.chooseCallBack;
      delete this.chooseCallBack;
      callBack(Interface.firstMatch(thisMock.value, this.chooseChoices));
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
REPLInterface.prototype.mockRequest = function (args) {
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
REPLInterface.prototype.start = function (application, presentation, callBack) {
  if (!(application instanceof Application)) throw new Error('Application required');
  if (!(presentation instanceof Presentation)) throw new Error('presentation required');
  if (typeof callBack != 'function') throw new Error('callBack required');
  this.application = application;
  this.presentation = presentation;
  this.startCallback = callBack;
};
REPLInterface.prototype.stop = function (callBack) {
  if (typeof callBack != 'function') throw new Error('callBack required');
};
REPLInterface.prototype.dispatch = function (request, response) {
  if (false === (request instanceof Request)) throw new Error('Request required');
  if (response && typeof response != 'function') throw new Error('response callback is not a function');
  if (!this.application || !this.application.dispatch(request)) {
    if (this.startCallback) {
      this.startCallback(request);
    }
  }
};
REPLInterface.prototype.notify = function (message) {
  if (false === (message instanceof Message)) throw new Error('Message required');
  if (this.captureOutputCallback) {
    this.captureOutputCallback(message);
  }
};
REPLInterface.prototype.render = function (presentation, callBack) {
  if (false === (presentation instanceof Presentation)) throw new Error('Presentation object required');
  if (callBack && typeof callBack != 'function') throw new Error('optional second argument must a commandRequest callback function');
};
REPLInterface.prototype.info = function (text) {
  if (!text || typeof text !== 'string') throw new Error('text required');
  if (this.captureOutputCallback) {
    this.captureOutputCallback(text);
  }
};

REPLInterface.prototype.ok = function (prompt, callBack) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (typeof callBack != 'function') throw new Error('callBack required');
  if (this.captureOutputCallback) {
    this.captureOutputCallback(prompt);
  }
  if (this.okPending) {
    delete this.okPending;
    callBack();
  } else {
    this.okCallBack = callBack;
  }
};
REPLInterface.prototype.yesno = function (prompt, callBack) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (typeof callBack != 'function') throw new Error('callBack required');
  if (this.captureOutputCallback) {
    this.captureOutputCallback(prompt);
  }
  if (this.yesnoPending) {
    delete this.yesnoPending;
    callBack(this.yesnoResponse);
  } else {
    this.yesnoCallBack = callBack;
  }
};
REPLInterface.prototype.ask = function (prompt, attribute, callBack) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (false === (attribute instanceof Attribute)) throw new Error('instance of Attribute a required parameter');
  if (typeof callBack != 'function') throw new Error('callBack required');
  if (this.captureOutputCallback) {
    this.captureOutputCallback(prompt);
  }
  if (this.askPending) {
    delete this.askPending;
    callBack(this.askResponse);
  } else {
    this.askCallBack = callBack;
  }
};
REPLInterface.prototype.choose = function (prompt, choices, callBack) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (false === (choices instanceof Array)) throw new Error('choices array required');
  if (!choices.length) throw new Error('choices array empty');
  if (typeof callBack != 'function') throw new Error('callBack required');
  if (this.captureOutputCallback) {
    this.captureOutputCallback(prompt);
    for (var i = 0; i < choices.length; i++) {
      this.captureOutputCallback('  ' + choices[i]);
    }
  }
  if (this.choosePending) {
    delete this.choosePending;
    callBack(Interface.firstMatch(this.chooseResponse, choices));
  } else {
    this.chooseCallBack = callBack;
    this.chooseChoices = choices;
  }
};
/**
 * Additional Methods
 */
REPLInterface.prototype.evaluateInput = function (line) {
  var callBack;
  var uLine = ('' + line).toUpperCase();
  /**
   * First priority for input capture - user queries
   */
  if (this.okCallBack) {
    callBack = this.okCallBack;
    delete this.okCallBack;
    callBack();
    return;
  }
  if (this.yesnoCallBack) {
    callBack = this.yesnoCallBack;
    delete this.yesnoCallBack;
    callBack(uLine == 'Y' || uLine == 'YES');
    return;
  }
  if (this.askCallBack) {
    callBack = this.askCallBack;
    delete this.askCallBack;
    callBack(line);
    return;
  }
  if (this.chooseCallBack) {
    callBack = this.chooseCallBack;
    delete this.chooseCallBack;
    callBack(Interface.firstMatch(line, this.chooseChoices));
    return;
  }
  /**
   * Do we have a primary navigation?
   */
  if (this.presentation && line.length) {
    var menu = this.presentation.get('contents');
    for (var i = 0; i < menu.length; i++) {
      var m = menu[i];
      var name = m.name.toUpperCase();
      if (left(name, uLine.length) == uLine) {
        m.execute();
        return;
      }
    }
    if (this.captureOutputCallback) this.captureOutputCallback('unrecognized: ' + line);
    return;
  }
  /**
   * This should never get this far ...
   */
  if (this.captureOutputCallback) this.captureOutputCallback('input ignored: ' + line);
}
;
REPLInterface.prototype.captureOutput = function (callback) {
  this.captureOutputCallback = callback;
};
