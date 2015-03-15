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
  this.navStack = [];
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
  var callback, result;
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
  if (thisMock.type == 'yes' || thisMock.type == 'no' || thisMock.type == 'cancel') {
    switch (thisMock.type) {
      case 'yes':
        result = true;
        break;
      case 'no':
        result = false;
        break;
      case 'cancel':
        result = undefined;
        break;
    }
    if (this.yesnocallback) {
      callback = this.yesnocallback;
      delete this.yesnocallback;
      callback(result);
    } else {
      this.yesnoPending = true;
      this.yesnoResponse = result;
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
REPLInterface.prototype.start = function (application, presentation, callback) {
  if (!(application instanceof Application)) throw new Error('Application required');
  if (!(presentation instanceof Presentation)) throw new Error('presentation required');
  if (typeof callback != 'function') throw new Error('callback required');
  this.application = application;
  this.presentation = presentation;
  this.startcallback = callback;
  this.evaluateInput(); // to trigger first prompt
};
REPLInterface.prototype.stop = function (callback) {
  if (typeof callback != 'function') throw new Error('callback required');
};
REPLInterface.prototype.dispatch = function (request, response) {
  if (false === (request instanceof Request)) throw new Error('Request required');
  if (response && typeof response != 'function') throw new Error('response callback is not a function');
  if (!this.application || !this.application.dispatch(request)) {
    if (this.startcallback) {
      this.startcallback(request);
    }
  }
};
REPLInterface.prototype.notify = function (message) {
  if (false === (message instanceof Message)) throw new Error('Message required');
  this._Output(message);
};
REPLInterface.prototype.render = function (presentation, presentationMode, callback) {
  if (false === (presentation instanceof Presentation)) throw new Error('Presentation object required');
  if (typeof presentationMode !== 'string') throw new Error('presentationMode required');
  if (!contains(Command.getPresentationModes(), presentationMode)) throw new Error('Invalid presentationMode: ' + presentationMode);
  if (callback && typeof callback != 'function') throw new Error('optional second argument must a commandRequest callback function');
  var contents = presentation.get('contents');
  var i;
  var width = 0;
  var obj;
  switch (presentationMode) {
    case 'View':
      for (i = 0; i < contents.length; i++)
        if (contents[i] instanceof Attribute && contents[i].label.length > width)
          width = contents[i].label.length;
      for (i = 0; i < contents.length; i++) {
        obj = contents[i];
        if (obj instanceof Attribute) {
          this._Output(lpad(obj.label, width) + ': ' + obj.value);
        } else {
          this._Output(obj);
        }
      }
      break;
    case 'Edit':
      this.editPresentationContents = contents.slice();
      while (this.editPresentationContents.length && !(this.editPresentationContents[0] instanceof Attribute)) {
        var ele = this.editPresentationContents.shift();
        if (!(ele instanceof Command))
          this._Output(ele);
      }
      if (this.editPresentationContents.length && (this.editPresentationContents[0] instanceof Attribute))
        this._setPrompt(this.editPresentationContents[0].label + ': ');
      if (!this.editPresentationContents.length) delete this.editPresentationContents;

      break;
    default:
      throw new Error('presentationMode not handled: ' + presentationMode);
  }
};
REPLInterface.prototype.info = function (text) {
  if (!text || typeof text !== 'string') throw new Error('text required');
  this._Output(text);
};
REPLInterface.prototype.ok = function (prompt, callback) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (typeof callback != 'function') throw new Error('callback required');
  this._Output(prompt);
  if (this.okPending) {
    delete this.okPending;
    callback();
  } else {
    this.okcallback = callback;
  }
};
REPLInterface.prototype.yesno = function (prompt, callback) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (typeof callback != 'function') throw new Error('callback required');
  this.yesnoPrompt = prompt;
  this._setPrompt(this.yesnoPrompt);
  if (this.yesnoPending) {
    delete this.yesnoPending;
    callback(this.yesnoResponse);
  } else {
    this.yesnocallback = callback;
  }
};
REPLInterface.prototype.ask = function (prompt, attribute, callback) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (false === (attribute instanceof Attribute)) throw new Error('attribute or callback expected');
  if (typeof callback != 'function') throw new Error('callback required');
  this.askPrompt = prompt;
  this._setPrompt(prompt);
  if (this.askPending) {
    delete this.askPending;
    callback(this.askResponse);
  } else {
    this.askcallback = callback;
  }
};
REPLInterface.prototype.choose = function (prompt, choices, callback) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (false === (choices instanceof Array)) throw new Error('choices array required');
  if (!choices.length) throw new Error('choices array empty');
  if (typeof callback != 'function') throw new Error('callback required');
  this.choosePrompt = prompt;
  this._Output(prompt);
  for (var i = 0; i < choices.length; i++) {
    this._Output('  ' + choices[i]);
  }
  this._setPrompt('Choice? ');
  if (this.choosePending) {
    delete this.choosePending;
    callback(Interface.firstMatch(this.chooseResponse, choices));
  } else {
    this.choosecallback = callback;
    this.chooseChoices = choices;
  }
};
/**
 * Additional Methods
 */
REPLInterface.prototype.evaluateInput = function (line) {
  var self = this;
  if (undefined === line) line = '';
  this._evaluateInput(line);
  setTimeout(function () {
    var prompt = self.application ? self.application.get('brand') : '?';
    if (!self.promptText && self.application && self.application.primaryInterface) {
      self._ShowNav();
    }
    if (self.promptText) {
      prompt = self.promptText;
      delete self.promptText;
    }
    if (self.capturePromptcallback)
      self.capturePromptcallback(prompt);
  }, 10);
};
REPLInterface.prototype._evaluateInput = function (line) {
  var callback;
  var uLine = ('' + line).toUpperCase();
  var i;
  var ele;
  /**
   * First priority for input capture - user queries
   */
  if (this.okcallback) {
    callback = this.okcallback;
    delete this.okcallback;
    callback();
    return;
  }
  if (this.yesnocallback) {
    if (uLine == 'Y' || uLine == 'YES') {
      callback = this.yesnocallback;
      delete this.yesnocallback;
      callback(true);
      return;
    } else if (uLine == 'N' || uLine == 'NO') {
      callback = this.yesnocallback;
      delete this.yesnocallback;
      callback(false);
      return;
    } else if (line.length === 0) {
      callback = this.yesnocallback;
      delete this.yesnocallback;
      callback();
      return;
    }
    this._Output('yes or no response required');
    this._setPrompt(this.yesnoPrompt);
    return;
  }
  if (this.askcallback) {
    callback = this.askcallback;
    delete this.askcallback;
    callback(line);
    return;
  }
  if (this.choosecallback) {
    callback = this.choosecallback;
    var match = Interface.firstMatch(line, this.chooseChoices);
    if (match) {
      delete this.choosecallback;
      callback(match);
    } else {
      if (line.length > 0) {
        this.application.info('"' + line + '" not valid');
        this._Output(this.choosePrompt);
        for (i = 0; i < this.chooseChoices.length; i++)
          this._Output('  ' + this.chooseChoices[i]);
        this._setPrompt('Choice? ');
      } else {
        delete this.choosecallback;
        callback();
      }
    }
    return;
  }
  /**
   * Edit Presentation in progress ?
   */
  if (this.editPresentationContents) {
    if (this.editPresentationContents.length && (this.editPresentationContents[0] instanceof Attribute)) {
      ele = this.editPresentationContents.shift();
      if (line.length)
        ele.value = line;
    }
    else {
      if (!this.editPresentationContents.length) delete this.editPresentationContents;
      throw new Error('editPresentationContents expected attribute');
    }
    while (this.editPresentationContents.length && !(this.editPresentationContents[0] instanceof Attribute)) {
      ele = this.editPresentationContents.shift();
      if (!(ele instanceof Command))
        this._Output(ele);
    }
    if (this.editPresentationContents.length && (this.editPresentationContents[0] instanceof Attribute))
      this._setPrompt(this.editPresentationContents[0].label + ': ');

    if (!this.editPresentationContents.length) delete this.editPresentationContents;
    return;
  }
  /**
   * Do we have a primary navigation?
   */
  if (this.presentation) {
    var menu = this.presentation.get('contents');
    if (this.navStack.length > 0) {
      var subMenu = this.navStack[this.navStack.length - 1];
      menu = subMenu.contents;
    }
    for (i = 0; i < menu.length; i++) {
      var m = menu[i];
      if (m instanceof Command) {
        var name = m.name.toUpperCase();
        if (line.length && left(name, uLine.length) == uLine) {
          switch (m.type) {
            case 'Stub':
              this.info(m.description + ' not available.');
              break;
            case 'Menu':
              this.navStack.push(m);
              break;
            case 'Presentation':
              m.presentationMode = 'Edit';
              m.execute(this);
              break;
            default:
              m.execute();
              break;
          }
          return;
        }
      }
    }
    if (line.length > 0) {
      this.application.info('"' + line + '" not valid');
    } else {
      this.navStack.pop();
    }
    return;
  }
  /**
   * This should never get this far ...
   */
  this._Output('input ignored: ' + line);
};
REPLInterface.prototype._ShowNav = function () {
  var brand = this.application ? this.application.get('brand') : '?';
  var menu = this.presentation.get('contents');
  var menuName = '';
  var commands = '';
  var prefix = '';
  var i;
  if (this.navStack.length > 0) {
    var subMenu = this.navStack[this.navStack.length - 1];
    menuName = subMenu.name.replace(/\s/g, '') + ': ';
    menu = subMenu.contents;
    for (i = 0; i < this.navStack.length; i++) {
      brand += ' / ' + this.navStack[i].name.replace(/\s/g, '');
    }
  }
  for (i = 0; i < menu.length; i++) {
    var m = menu[i];
    if (m instanceof Command) {
      commands += ( prefix + m.name.replace(/\s/g, '') );
      prefix = ', ';
    }
  }
  this.application.info(menuName + commands);
  this._setPrompt(brand + '>');
};
REPLInterface.prototype.captureOutput = function (callback) {
  this.captureOutputcallback = callback;
};
REPLInterface.prototype.capturePrompt = function (callback) {
  this.capturePromptcallback = callback;
};
REPLInterface.prototype._setPrompt = function (text) {
  this.promptText = text;
};
REPLInterface.prototype._Output = function (text) {
  if (this.captureOutputcallback)
    this.captureOutputcallback(text);
};