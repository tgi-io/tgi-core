/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core-message.source.js
 */
/**
 * Constructor
 */
function Message(type, contents) {
  if (false === (this instanceof Message)) throw new Error('new operator required');
  if ('undefined' == typeof type) throw new Error('message type required');
  if (!contains(Message.getTypes(), type)) throw new Error('Invalid message type: ' + type);
  this.type = type;
  this.contents = contents;
}
/**
 * Methods
 */
Message.prototype.toString = function () {
  switch (this.type) {
    case 'Null':
      return this.type + ' Message';
    default:
      return this.type + ' Message: ' + this.contents;
  }
};
/**
 * Simple functions
 */
Message.getTypes = function () {
  return [
    'Null',
    'Connected',
    'Error',
    'Sent',
    'Ping',
    'PutModel',
    'PutModelAck',
    'GetModel',
    'GetModelAck',
    'DeleteModel',
    'DeleteModelAck',
    'GetList',
    'GetListAck'
  ].slice(0); // copy array
};
