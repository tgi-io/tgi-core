/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/misc/test-header
 **/
(function () {
"use strict";
var root = this;
/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/test/tgi-test.js
 **/
var TestTGI = function () {
  return {
    loadTests: loadTests,
    bootstrapTests: bootstrapTests
  };
};
/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/test/tgi-test-bootstrap.js
 **/
function bootstrapTests(TGI,callback) {
  var bootstrap = {error: false, assertions: []};
  try {
    var tgi, spec;
    bootstrapAssert('TGI function exists', typeof TGI === 'function');
    bootstrapAssert('TGI returns object', typeof (tgi = TGI()) === 'object');
    bootstrapAssert('tgi.Spec function exists', typeof (tgi.Spec) === 'function');
    bootstrapAssert('tgi.Spec operates as constructor', (spec = new tgi.Spec()) instanceof tgi.Spec);
    bootstrapAssert('new object has nodes property (Array)', spec.nodes instanceof Array);
    bootstrapAssert('tgi.Spec.Node function exists', typeof (tgi.Spec.Node) === 'function');
    bootstrapThrows('new tgi.Spec.Node must supply type', Error('Spec.Node type must be h, p or e'), function () {
      new tgi.Spec.Node();
    });
    bootstrapAssert('tgi.Spec.Node operates as constructor', (new tgi.Spec.Node({type: 'e'})) instanceof tgi.Spec.Node);
    bootstrapAssert('tgi.Spec.paragraph function exists', typeof (spec.paragraph) === 'function');
    bootstrapThrows('tgi.Spec.paragraph requires text argument', Error('Spec.paragraph requires text argument'), function () {
      new tgi.Spec().paragraph('');
    });
    bootstrapAssert('tgi.Spec.paragraph argument sets node.text', function () {
      // It also returns the node it created
      return spec.paragraph('sup').text == 'sup';
    }());
    bootstrapAssert('tgi.Spec.heading function exists', typeof (spec.heading) === 'function');
    bootstrapThrows('tgi.Spec.heading requires text argument', Error('Spec.heading requires text argument'), function () {
      new tgi.Spec().heading('');
    });
    bootstrapAssert('tgi.Spec.heading argument sets node.text', function () {
      // It also returns the node it created
      return spec.heading('sup').text == 'sup';
    }());
    bootstrapAssert('tgi.Spec.example function exists', typeof (spec.example) === 'function');
    bootstrapThrows(' tgi.Spec.example requires text argument', Error('Spec.example requires text argument'), function () {
      new tgi.Spec().example('');
    });
    bootstrapAssert('tgi.Spec.example 2nd arg is expected results', true); // no way to test all possible values including undefined allowed
    bootstrapThrows('tgi.Spec.example 3rd arg is function (code for example)', Error('Spec.example 3rd arg is function code or undefined'), function () {
      new tgi.Spec().example('test', true);
    });
    bootstrapAssert('tgi.Spec.start function exists', typeof (spec.start) === 'function');
    bootstrapAssert('tgi.Spec.stop function exists', typeof (spec.stop) === 'function');
    bootstrapAssert('tgi.Spec.show function exists', typeof (spec.show) === 'function');
    bootstrapAssert('tgi.Spec.asyncResponse function exists', typeof (spec.asyncResponse) === 'function');
  } catch (e) {
    bootstrap.error = e;
  }
  return bootstrap;
  // Assertion Function
  function bootstrapAssert(description, assertion) {
    bootstrap.assertions.push(description);
    callback({log: description});
    if (assertion !== true)
      throw new Error('assertion failed: ' + description)
  }
  // When expect error to be thrown
  function bootstrapThrows(description, err, func) {
    var gotError = false;
    bootstrap.assertions.push(description);
    callback({log: description});
    try {
      func();
    } catch (e) {
      gotError = true;
      if (err !== undefined && err.toString() != e.toString() && err.toString() != '*') {
        throw('expected error(' + err + ') got(' + e + ')');
      }
    }
    if (!gotError) {
      throw('expected error(' + err + ')');
    }
  }
}
/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/test/tgi-test-loadTests.js
 **/
function loadTests(testTGI, TGI, callback) {
  var bootstrap = testTGI().bootstrapTests(TGI,callback);
  if (bootstrap.error) {
    callback({error: Error('bootstrap test failed: ' + bootstrap.error)});
    return;
  }
  callback({done: true});
}
/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core-test.js
 **/
console.log('sup foo');
/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core-spec-test.js
 **/

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/misc/test-footer
 **/
  /* istanbul ignore next */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = TestTGI;
    }
    exports.TestTGI = TestTGI;
  } else {
    root.TestTGI = TestTGI;
  }
}).call(this);