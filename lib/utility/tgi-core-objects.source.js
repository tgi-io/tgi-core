/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/utility/tgi-core-objects.source.js
 */
/**
 * inheritPrototype(p) - inherit prototype p
 */
/* istanbul ignore next */
var inheritPrototype = function (p) {
  if (p === null) throw new TypeError();
  if (Object.create) return Object.create(p);
  var t = typeof p;
  if (t !== "object" && typeof t !== "function") throw new TypeError();

  function F() {
  }

  F.prototype = p;
  return new F();
};
/**
 * getInvalidProperties(args, allowedProperties) - used in object creation to validate constructor properties
 */
var getInvalidProperties = function (args, allowedProperties) {
  var props = [];
  for (var property in args) {
    if (args.hasOwnProperty(property)) {
      if (!contains(allowedProperties, property)) {
        props.push(property);
      }
    }
  }
  return props;
};

/**
 * getConstructorFromModelType(modelType)
 */
var getConstructorFromModelType = function (modelType) {
  return Model._ModelConstructor[modelType] || Model;
};

/**
 * createModelFromModelType(modelType)
 */
var createModelFromModelType = function (modelType) {
  var ProxyModel = getConstructorFromModelType(modelType);
  return new ProxyModel();
};

/**
 * getObjectFromCPON
 */

var getObjectFromCPON = function (cpon, obj) {
  if (typeof cpon !== 'string')
    throw new Error('expected CPON string');

  if (obj === undefined)
    obj = {};

  var caret = cpon.indexOf('^');
  if (caret < 0)
    throw new Error('caret (^) not found in garden');

  var key = left(cpon, caret);
  var value = cpon.substring(caret + 1);
  var pipe = value.indexOf('|');
  if (pipe > -1) {
    obj = getObjectFromCPON(value.substring(pipe + 1),obj);
    value = left(value,pipe);
  }
  obj[key] = value;
  return obj;
};
