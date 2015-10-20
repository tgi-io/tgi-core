/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core-text.source.js
 */
/**
 * Constructor
 */
function Text(contents) {
  if (false === (this instanceof Text)) throw new Error('new operator required');
  this.contents = contents || '';
  this._eventListeners = [];
}
/**
 * Methods
 */
Text.prototype.toString = function () {
  return 'Text: \'' + (this.contents || '') + '\'';
};
Text.prototype.get = function () {
  return this.contents;
};
Text.prototype.set = function (newValue) {
  this.contents = newValue;
  this._emitEvent('StateChange');
  return this.contents;
};
Text.prototype._emitEvent = function (event) {
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
Text.prototype.onEvent = function (events, callback) {
  if (!(events instanceof Array)) {
    if (typeof events != 'string') throw new Error('subscription string or array required');
    events = [events]; // coerce to array
  }
  if (typeof callback != 'function') throw new Error('callback is required');
  // Check known Events
  for (var i in events) {
    if (events.hasOwnProperty(i))
      if (events[i] != '*')
        if (!contains(['StateChange'], events[i]))
          throw new Error('Unknown command event: ' + events[i]);
  }
  // All good add to chain
  this._eventListeners.push({events: events, callback: callback});
  return this;
};
Text.prototype.offEvent = function () {
  this._eventListeners = [];
};