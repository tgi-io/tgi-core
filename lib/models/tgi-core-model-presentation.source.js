/**
 * lib/models/tgi-core-model-presentation.source.js
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
  this.presentationMode = "View";
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
        if (!(contents[i] instanceof Text || contents[i] instanceof Command || contents[i] instanceof Attribute || contents[i] instanceof List || typeof contents[i] == 'string'))
          gotError = true;
      }
      if (gotError)
        this.validationErrors.push('contents elements must be Text, Command, Attribute, List or string');
    } else {
      this.validationErrors.push('contents must be Array');
    }
  }
  this.validationMessage = this.validationErrors.length > 0 ? this.validationErrors[0] : '';
  return this.validationErrors;
};

Presentation.prototype.validate = function (callback) {
  var presentation = this;
  if (typeof callback != 'function') throw new Error('callback is required');
  this.getObjectStateErrors();
  var e;
  for (e in this._errorConditions) {
    if (this._errorConditions.hasOwnProperty(e)) {
      this.validationErrors.push(this._errorConditions[e]);
    }
  }

  if (this.presentationMode !== 'View' && this.presentationMode !== 'Edit')
    this.validationErrors.push('invalid presentationMode');

  // validate each attribute in contents
  var i;
  var gotError = false;
  var attributeCount = 0;
  var checkCount = 0;
  var contents = this.get('contents');
  if (!contents instanceof Array)
    contents = [];

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

  // If no attributes call callback since checkAttrib not called
  if (contents.length < 1)
    finishUp();

  function checkAttrib() {
    checkCount++;
    // this is the attribute TODO this bad usage ?
    if (this.validationMessage) // jshint ignore:line
      gotError = true;
    if (attributeCount == checkCount) {
      if (gotError)
        presentation.validationErrors.push('contents has validation errors');
      finishUp();
    }
  }

  function finishUp() {
    presentation.validationMessage = presentation.validationErrors.length > 0 ? presentation.validationErrors[0] : '';
    callback();
  }

};
