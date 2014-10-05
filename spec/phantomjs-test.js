/**
 * tgi-core
 * phantomjs-test
 *
 * TODO migrate this to project changes <broken>
 */

/*
function waitFor(testFx, onReady, timeOutMillis) {
  var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3001, //< Default Max Timeout is 3s
    start = new Date().getTime(),
    condition = false,
    interval = setInterval(function () {
      if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
        // If not time-out yet and condition not yet fulfilled
        condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
      } else {
        if (!condition) {
          // If condition still not fulfilled (timeout but condition is 'false')
          console.log("'waitFor()' timeout");
          phantom.exit(1);
        } else {
          // Condition fulfilled (timeout and/or condition is 'true')
          console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
          typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
          clearInterval(interval); //< Stop this interval
        }
      }
    }, 100); //< repeat check every 100ms
};


console.log('Loading a web page');
var page = require('webpage').create();
page.open('spec/html-test.html', function (status) {
  if (status !== "success") {
    console.log("Unable to access network");
    phantom.exit(1);
  } else {
    waitFor(function () {
      return page.evaluate(function () {
        var el = document.getElementById('testresult');
        if (el && el.innerText.match('Hello World')) {
          return true;
        }
        return false;
      });
    }, function () {
      var failedNum = page.evaluate(function () {
        var el = document.getElementById('testresult');
        console.log(el.innerText);
        try {
          return el.getElementsByClassName('failed')[0].innerHTML;
        } catch (e) {
        }
        return 10000;
      });
      phantom.exit((parseInt(failedNum, 10) > 0) ? 1 : 0);
    });
  }
});
*/