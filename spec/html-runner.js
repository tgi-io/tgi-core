/**---------------------------------------------------------------------------------------------------------------------
 * tgi-spec/spec/html-runner.js
 **/
var spec = new Spec();
(function () {
  UTILITY().injectMethods(this);
  //this.inheritPrototype = UTILITY().inheritPrototype;
  testSpec(spec, UTILITY);
  spec.runTests(function (msg) {
    /**
     * msg callback events msg.error, msg.log, msg.done
     */
    if (msg.error) {
      logError(msg.error);
    } else if (msg.done) {
      if (msg.testsFailed || msg.testsPending)
        logError(msg.testsCreated + ' Tests attempted with ' + msg.testsFailed + ' errors');
      else
        logSuccess(msg.testsCreated + ' Tests completed with no errors');
    } else if (msg.log) {
      log(msg.log);
    }
    /**
     * DOM rendering functions
     */
    function log(txt) {
      var p = document.createElement("p");
      p.style.margin = '2px';
      p.style.padding = '1px';
      p.style.backgroundColor = "#FFFFF0";
      p.style.border = "solid";
      p.style.borderWidth = "1px";
      p.style.borderColor = "#7F7F8F";
      p.style.lineHeight = "1.0";
      p.appendChild(document.createTextNode(txt));
      document.body.appendChild(p);
    }
    function logError(txt) {
      var p = document.createElement("p");
      p.style.fontWeight = "bold";
      p.style.margin = '2px';
      p.style.padding = '1px';
      p.style.backgroundColor = "#FFCCCC";
      p.style.border = "solid";
      p.style.borderWidth = "1px";
      p.style.lineHeight = "1.5";
      p.appendChild(document.createTextNode(txt));
      document.body.appendChild(p);
    }
    function logSuccess(txt) {
      var p = document.createElement("p");
      p.style.fontWeight = "bold";
      p.style.margin = '2px';
      p.style.padding = '1px';
      p.style.backgroundColor = "#CCFFCC";
      p.style.border = "solid";
      p.style.borderWidth = "1px";
      p.style.lineHeight = "1.5";
      p.appendChild(document.createTextNode(txt));
      document.body.appendChild(p);
    }
  });
}());
