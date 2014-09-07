/*** lib-header ***/
(function () {
"use strict";
var root = this;
/*** lib-header ***/


/**
 * tgi-core
 * tgi-core
 */

var tgi = function () {
  return 'Hello World';
};

/*** lib-footer ***/
  /* istanbul ignore next */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = tgi;
    }
    exports.tgi = tgi;
  } else {
    root.tgi = tgi;
  }
}).call(this);
/*** lib-footer ***/
