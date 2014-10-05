/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/misc/lib-header
 **/
(function () {
"use strict";
var root = this;
/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core.js
 **/
var CORE = function () {
  return {
    version: '0.0.7',
    injectMethods: function (that) {
      //that.inheritPrototype = inheritPrototype;
    }
  };
};
/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/misc/lib-footer
 **/
  /* istanbul ignore next */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = CORE;
    }
    exports.CORE = CORE;
  } else {
    root.CORE = CORE;
  }
}).call(this);