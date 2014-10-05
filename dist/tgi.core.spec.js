/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/misc/test-header
 **/
(function () {
"use strict";
var root = this;
var testSpec = function(spec,CORE) {
/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/misc/test-footer
 **/
};
  /* istanbul ignore next */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = testSpec;
    }
    exports.testSpec = testSpec;
  } else {
    root.testSpec = testSpec;
  }
}).call(this);