/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/misc/test-header
 **/
(function () {
"use strict";
var root = this;
var testSpec = function(spec,CORE) {
/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core.test.js
 **/
spec.test('tgi-core/lib/tgi-core.test.js', 'Core Library', function (callback) {
  callback({log: 'tgi-core/lib/tgi-core.test.js'});
  spec.heading('TGI CORE', function () {
    spec.paragraph('blah blah blah blah blah blah blah blah blah blah blah blah blah ');
  });
});

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