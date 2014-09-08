/**
 * tgi-core
 * test-runner
 */
"use strict";

/** runner() function made public in node and browser */
(function () {
  "use strict";
  var root = this;

  /** test runner */
  var runner = function (tgi, callback) {

    var bootstrap = runBootstrapTests(tgi);
    if (bootstrap.error) {
      callback(Error('bootstrap test failed: ' + bootstrap.error));
      return;
    }

    //  console.log('test runner here:' + tgi());
    ////callback(Error('fuck it'));
    //  //callback(tgi() == 'shit');
    //
    //  setTimeout(function () {
    //    callback();
    //  }, 1000);
    //
    callback();
  };

  /** Have to test the test objects in tgi-core first **/
  function runBootstrapTests(tgi) {
    var bootstrap = {error: false, assertions: []};
    try {
      assert('tgi object exists', typeof tgi() === 'object');
      assert('tgi.Spec function exists', typeof (tgi().Spec) === 'function');
      assert('xxx', true);
    } catch (e) {
      bootstrap.error = e;
    }
    return bootstrap;
    // Assertion Function
    function assert(description, assertion) {
      bootstrap.assertions.push(description);
      console.log(description);
      if (assertion !== true)
        throw new Error('assertion failed: ' + description)
    }
  }

  /** module crap follows */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = runner;
    }
    exports.runner = runner;
  } else {
    root.runner = runner;
  }
}).call(this);
