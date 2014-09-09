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
  function runBootstrapTests(TGI) {
    var bootstrap = {error: false, assertions: []};
    try {
      var tgi, spec, node;
      bootstrapAssert('TGI function exists', typeof TGI === 'function');
      bootstrapAssert('TGI returns object', typeof (tgi = TGI()) === 'object');
      bootstrapAssert('tgi.Spec function exists', typeof (tgi.Spec) === 'function');
      bootstrapAssert('tgi.Spec operates as constructor', (spec = new tgi.Spec()) instanceof tgi.Spec);
      bootstrapAssert('new object has nodes property (Array)', spec.nodes instanceof Array);
      bootstrapAssert('tgi.Spec.Node function exists', typeof (tgi.Spec.Node) === 'function');
      bootstrapShouldThrow('new tgi.Spec.Node must supply type', Error('Spec.Node type must be h, p or e'), function () {
        new tgi.Spec.Node();
      });
      bootstrapAssert('tgi.Spec.Node operates as constructor', (new tgi.Spec.Node({type: 'e'})) instanceof tgi.Spec.Node);
      //bootstrapAssert('xxx', true);
      //bootstrapAssert('xxx', true);
      //bootstrapAssert('xxx', true);
      //bootstrapAssert('xxx', true);
      //bootstrapAssert('xxx', true);
      //bootstrapAssert('xxx', true);
    } catch (e) {
      bootstrap.error = e;
    }
    return bootstrap;

    // Assertion Function
    function bootstrapAssert(description, assertion) {
      bootstrap.assertions.push(description);
      console.log(description);
      if (assertion !== true)
        throw new Error('assertion failed: ' + description)
    }

    // When expect error to be thrown
    function bootstrapShouldThrow(description, err, func) {
      var gotError = false;
      bootstrap.assertions.push(description);
      console.log(description);
      try {
        func();
      } catch (e) {
        gotError = true;
        if (err !== undefined)
          if (err.toString() != e.toString() && err.toString() != '*')
            throw('expected error(' + err + ') got(' + e + ')');
      }
      if (!gotError) {
        throw('expected error(' + err + ')');
      }
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
