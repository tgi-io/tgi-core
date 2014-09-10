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
  function runner(TGI, callback) {
    root.callback = callback;
    var bootstrap = runBootstrapTests(TGI);
    if (bootstrap.error) {
      root.callback({error: Error('bootstrap test failed: ' + bootstrap.error)});
      return;
    }
    root.callback({done: true});
  }

  /** Have to test the test objects in tgi-core first **/
  function runBootstrapTests(TGI) {
    var bootstrap = {error: false, assertions: []};
    try {
      var tgi, spec;
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
      bootstrapAssert('tgi.Spec.paragraph function exists', typeof (spec.paragraph) === 'function');
      bootstrapShouldThrow('new tgi.Spec.paragraph requires text argument', Error('Spec.paragraph requires text argument'), function () {
        new tgi.Spec().paragraph('');
      });
      bootstrapAssert('tgi.Spec.paragraph argument sets node.text', function () {
        // It also returns the node it created
        return spec.paragraph('sup').text == 'sup';
      }());
      bootstrapAssert('tgi.Spec.heading function exists', typeof (spec.heading) === 'function');
      bootstrapShouldThrow('new tgi.Spec.heading requires text argument', Error('Spec.heading requires text argument'), function () {
        new tgi.Spec().heading('');
      });
      bootstrapAssert('tgi.Spec.heading argument sets node.text', function () {
        // It also returns the node it created
        return spec.heading('sup').text == 'sup';
      }());
      bootstrapAssert('tgi.Spec.example function exists', typeof (spec.example) === 'function');
      bootstrapShouldThrow('new tgi.Spec.example requires text argument', Error('Spec.example requires text argument'), function () {
        new tgi.Spec().example('');
      });
      bootstrapAssert('new tgi.Spec.example 2nd arg is expected results', true); // no way to test all possible values including undefined allowed
      bootstrapShouldThrow('new tgi.Spec.example 3rd arg is function (code for example)', Error('Spec.example 3rd arg is function code or undefined'), function () {
        new tgi.Spec().example('test', true);
      });


      //bootstrapAssert('tgi.Spec.example argument sets node.text', function () {
      //  // It also returns the node it created
      //  return spec.example('sup').text == 'sup';
      //}());

      //bootstrapAssert('xxx', true);
      //bootstrapAssert('xxx', true);
      //bootstrapAssert('xxx', true);
      //bootstrapAssert('xxx', true);
      //bootstrapAssert('xxx', true);
      //bootstrapAssert('xxx', true);
      //bootstrapAssert('xxx', true);
      //bootstrapAssert('xxx', true);
      //bootstrapAssert('xxx', true);
      //bootstrapAssert('xxx', true);
      //bootstrapAssert('xxx', true);
      //bootstrapAssert('xxx', true);
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
      root.callback({log: description});
      if (assertion !== true)
        throw new Error('assertion failed: ' + description)
    }

    // When expect error to be thrown
    function bootstrapShouldThrow(description, err, func) {
      var gotError = false;
      bootstrap.assertions.push(description);
      root.callback({log: description});
      try {
        func();
      } catch (e) {
        gotError = true;
        if (err !== undefined && err.toString() != e.toString() && err.toString() != '*') {
          console.log('shit');
          throw('expected error(' + err + ') got(' + e + ')');
        }

      }
      if (!gotError) {
        console.log('fuck');
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
