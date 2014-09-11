/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core-spec.js
 **/
function Spec() {
  this.nodes = []; // array of Spec.Node's
}
/**
 * Spec.Node object for each piece of spec types as follows:
 * h - heading
 * p - paragraph
 * e - example (test)
 **/
Spec.Node = function (args) {
  args = args || {};
  this.type = args.type || null;
  if (!this.type || ((this.type != 'h') && (this.type != 'p') && (this.type != 'e'))) {
    throw new Error('Spec.Node type must be h, p or e');
  }
};
/**
 * Create a paragraph node
 **/
Spec.prototype.paragraph = function (text) {
  if (typeof text !== 'string' || text === '') {
    throw new Error('Spec.paragraph requires text argument');
  }
  var node = new Spec.Node({type: 'p'});
  node.text = text;
  this.nodes.push(node);
  return node;
};
/**
 * Create a heading node
 **/
Spec.prototype.heading = function (text) {
  if (typeof text !== 'string' || text === '') {
    throw new Error('Spec.heading requires text argument');
  }
  var node = new Spec.Node({type: 'h'});
  node.text = text;
  this.nodes.push(node);
  return node;
};
/**
 * Create a example node
 **/
Spec.prototype.example = function (text, results, callback) {
  if (typeof text !== 'string' || text === '') {
    throw new Error('Spec.example requires text argument');
  }
  if (typeof callback !== 'function') {
    throw new Error('Spec.example 3rd arg is function code or undefined');
  }
  var node = new Spec.Node({type: 'e'});
  node.text = text;
  this.nodes.push(node);
  return node;
};
/**
 *
 **/
Spec.prototype.start = function () {
};
/**
 *
 **/
Spec.prototype.stop = function () {
};
/**
 *
 **/
Spec.prototype.show = function () {
};
/**
 *
 **/
Spec.prototype.asyncResponse = function () {
};
