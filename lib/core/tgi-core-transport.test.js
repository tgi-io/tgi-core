/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-transport.spec.js
 */
spec.test('tgi-core/lib/tgi-core-transport.spec.js', 'Transport', '<insert description>', function (callback) {
  if (typeof io == 'undefined') return; // todo
  spec.heading('Transport Class', function () {
//    if (typeof io == 'undefined') {
    //spec.examplesDisabled = true;
    spec.paragraph('tests disabled socket.io too spammy in console');
//      spec.paragraph('tests disabled socket.io not detected');
//    }
    spec.paragraph('Handle message passing between host and UI.');
    spec.heading('CONSTRUCTOR', function () {
      spec.example('objects created should be an instance of Transport', true, function () {
        return new Transport("*wtf*", function () {
          }) instanceof Transport;
      });
      spec.example('must be instantiated with new', Error('new operator required'), function () {
        Transport("", function () { // jshint ignore:line
        });
      });
      spec.example('must pass url string', Error('argument must a url string'), function () {
        new Transport();
      });
      spec.paragraph('The connection success is signaled via callback. use function(msg){} for' +
      'callback.  msg.Connection indications success, msg.Error for failure (msg.contents' +
      'contains error).');
      spec.example('must pass callback function', Error('argument must a callback'), function () {
        new Transport('');
      });
      spec.example('url must be valid', spec.asyncResponse('Error Message: cannot connect'), function (testNode, returnResponse) {
        new Transport('*url*', function (message) {
          returnResponse(testNode, message);
        }, this);
      });
    });
    spec.heading('METHODS', function () {
      spec.heading('send(message)', function () {
        spec.paragraph('send() is used to send messages to host or UI.  Any errors returned are based on state checks' +
        ' and not resulting from async errors.' +
        ' If confirmation is needed provide callback to notify message has been sent or error has occurred.');
        spec.example('message param required', Error('message required'), function () {
          new Transport("", function () {
          }).send();
        });
        spec.example('message param must be type Message', Error('parameter must be instance of Message'), function () {
          new Transport("", function () {
          }).send('money');
        });
        spec.example('Transport must be connected (async error message)', spec.asyncResponse('Error Message: not connected'), function (testNode, returnResponse) {
          new Transport("*bad*", function () {
            this.send(new Message('Null'), function (msg) {
              returnResponse(testNode, msg);
            });
          });
        });
        spec.example('optional callback must be function', Error('argument must a callback'), function () {
          new Transport("", function () {
          }).send(new Message('Null'), Infinity);
        });
        spec.example('if callback used messages sent are acknowledged', spec.asyncResponse(true), function (testNode, returnResponse) {
          spec.hostStore.transport.send(new Message('Null'), function (msg) {
            returnResponse(testNode, msg);
          });
        });
      });
      spec.heading('close()', function () {
        spec.xexample('Transport must be connected (async error message)', spec.asyncResponse('jobs done'), function (testNode, returnResponse) {
          new Transport("", function () {
            this.close(); // TODO can't open 2 transports to same URL so can't test this since it conflicts with hostStore
            returnResponse(testNode, "jobs done");
          });
        });
      });
    });
    //spec.examplesDisabled = false;
  });

});
