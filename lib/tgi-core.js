/**
 * tgi-core
 * tgi-core
 */

"use strict";

(function () {
  var root = this;
  var TGI = function () {
    return 'Hello World';
  };
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = TGI;
    }
    exports.TGI = TGI;
  } else {
    root.TGI = TGI;
  }
}).call(this);
