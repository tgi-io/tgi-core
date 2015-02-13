/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core-transport.source.js
 */
/* istanbul ignore next */
function Transport(location, callback) {
  if (false === (this instanceof Transport)) throw new Error('new operator required');
  if (typeof location != 'string') throw new Error('argument must a url string');
  if (typeof callback != 'function') throw new Error('argument must a callback');
  var self = this;
  self.connected = false;
  self.initialConnect = true;
  self.location = location;
  if (self.location === '') self.location = 'http host';
  self.socket = io.connect(location, {reconnection: false});
  self.socket.on('connect', function () {
    self.connected = true;
    self.initialConnect = false;
    console.log('socket.io (' + self.location + ') connected');
    callback.call(self, new Message('Connected', ''));
  });
  self.socket.on('connecting', function () {
    console.log('socket.io (' + self.location + ') connecting');
  });
  self.socket.on('error', function (reason) {
    var theError = 'general error with ' + self.location + (reason ? ', reason ' + reason : '');
    console.error(theError);
    // If have not ever connected then signal error
    if (self.initialConnect) {
      callback.call(self, new Message('Error', theError));
    }
  });
  self.socket.on('connect_error', function (reason) {
    var theError = 'connect error with ' + self.location + (reason ? ', reason ' + reason : '');
    console.error(theError);
    // If have not ever connected then signal error
    if (self.initialConnect) {
      callback.call(self, new Message('Error', theError));
    }
  });
  self.socket.on('connect_failed', function (reason) {
    var theError = 'connect failed with ' + self.location + (reason ? ', reason ' + reason : '');
    console.error(theError);
    // If have not ever connected then signal error
    if (self.initialConnect) {
      callback.call(self, new Message('Error', theError));
    }
  });
  self.socket.on('message', function (obj) {
    console.log('socket.io (' + self.location + ') message: ' + obj);
  });
  self.socket.on('disconnect', function (reason) {
    self.connected = false;
    console.log('socket.io (' + self.location + ') disconnect: ' + reason);
  });
}
/**
 * pub/sub thingies
 */
Transport.messageHandlers = {};
Transport.setMessageHandler = function (message, handler) {
  Transport.messageHandlers[message] = handler;
};
Transport.hostMessageProcess = function (obj, fn) {
  if (Transport.messageHandlers[obj.type]) {
    Transport.messageHandlers[obj.type](obj.contents, fn);
  } else {
//          console.log('socket.io ackmessage: ' + JSON.stringify(obj));
    fn(true); // todo should this be an error?
  }
};

/**
 * Methods
 */
/* istanbul ignore next */
Transport.prototype.send = function (message, callback) {
  var self = this;
  if (typeof message == 'undefined') throw new Error('message required');
  if (!(message instanceof Message)) throw new Error('parameter must be instance of Message');
  if (typeof callback != 'undefined' && typeof callback != 'function') throw new Error('argument must a callback');
  if (!this.connected) {
    callback.call(self, new Message('Error', 'not connected'));
    return;
  }
  if (typeof callback != 'undefined') {
    self.socket.emit('ackmessage', message, function (msg) {
      callback.call(self, msg);
    });
  } else {
    self.socket.send(message);
  }
};
/* istanbul ignore next */
Transport.prototype.close = function () {
  if (!this.connected)
    throw new Error('not connected');
  this.socket.disconnect();
};
