/*** lib-header ***/
(function () {
"use strict";
var root = this;
/*--------------------------------------------------------------------------------------------------------------------*/
/**
 * tgi-core
 * tgi-core
 */

var TGI = function () {
  return {
    Spec: Spec
  };
};
/*--------------------------------------------------------------------------------------------------------------------*/
/**
 * tgi-core
 * tgi-core-spec
 */
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
  if (!this.type || ((this.type != 'h') && (this.type != 'p') && (this.type != 'e')) ) {
    throw new Error('Spec.Node type must be h, p or e');
  }
};
/*--------------------------------------------------------------------------------------------------------------------*/
/*** lib-footer ***/
  /* istanbul ignore next */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = TGI;
    }
    exports.TGI = TGI;
  } else {
    root.TGI = TGI;
  }
}).call(this);
/*** lib-footer ***/