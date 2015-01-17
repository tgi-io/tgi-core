/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core-request.source.js
 */
/**
 * Constructor
 */
function Request(args) {
  if (false === (this instanceof Request)) throw new Error('new operator required');
  if (typeof args == 'string') {
    var quickType = args;
    args = {};
    args.type = quickType;
  }
  args = args || {};
  this.type = args.type || null;
  if (args.value) // todo spec as optional param
    this.value = args.value;
  if (!this.type || typeof this.type != 'string') throw new Error('Request type required');
  switch (this.type) {
    case 'Command':
      this.command = args.command || null;
      if (!(this.command instanceof Command)) throw new Error('command object required');
      break;
  }
}
/**
 * Methods
 */
Request.prototype.toString = function () {
  switch (this.type) {
    case 'Command':
      return this.type + ' Request: ' + this.command;
    default:
      return this.type + ' Request';
  }
};
