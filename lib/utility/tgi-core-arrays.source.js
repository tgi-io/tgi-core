/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/utility/tgi-core-arrays.source.js
 */
/**
 * contains(a, obj) returns true if obj is contained in array (a)
 */
var contains = function (a, obj) {
  for (var i = 0; i < a.length; i++) {
    if (a[i] === obj) return true;
  }
  return false;
};
