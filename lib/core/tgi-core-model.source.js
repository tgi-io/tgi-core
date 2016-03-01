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
Model._ModelConstructor = {};
/**
 * Methods
 */
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
Model.prototype.attribute = function (attributeName) {
  for (var i = 0; i < this.attributes.length; i++) {
    if (this.attributes[i].name.toUpperCase() == attributeName.toUpperCase())
      return this.attributes[i];
  }
  throw new Error('attribute not found in model: ' + attributeName);
};
Model.prototype.get = function (attribute) {
  for (var i = 0; i < this.attributes.length; i++) {
    if (this.attributes[i].name.toUpperCase() == attribute.toUpperCase())
      return this.attributes[i].get();
  }
};
Model.prototype.getShortName = function () {
  for (var i = 0; i < this.attributes.length; i++) {
    if (this.attributes[i].type == 'String')
      return this.attributes[i].get();
  }
  return '';
};
Model.prototype.getLongName = function () {
  return this.getShortName();
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
      this.attributes[i].set(value);
      this._emitEvent('StateChange');
      return;
    }
  }
  throw new Error('attribute not valid for model');
};
Model.prototype.validate = function (callback) {
  var model = this;
  var i, e;
  var validationsPending = 0; // track callbacks sent
  if (typeof callback != 'function') throw new Error('callback is required');
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
    callback.call(model);
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
            callback.call(model);
          }
        });
      }, 0);
    }(model.attributes[i]));
  }
  /* jshint ignore:end */

//  // All done...
//  this.validationMessage = this.validationErrors.length > 0 ? this.validationErrors[0] : '';
//  this._emitEvent('StateChange');
//  callback.call(this);

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
Model.prototype._emitEvent = function (event, meta) { // todo meta is app defined - no test for it
  var i;
  for (i in this._eventListeners) {
    if (this._eventListeners.hasOwnProperty(i)) {
      var subscriber = this._eventListeners[i];
      if ((subscriber.events.length && subscriber.events[0] === '*') || contains(subscriber.events, event)) {
        subscriber.callback.call(this, event, meta);
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