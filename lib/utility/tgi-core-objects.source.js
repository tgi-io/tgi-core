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
