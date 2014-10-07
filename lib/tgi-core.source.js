/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core.js
 **/
var CORE = function () {
  return {
    version: '0.0.7',
    Attribute: Attribute,
    Model: Model,
    injectMethods: function (that) {
      that.Attribute = Attribute;
      that.Model = Model;
    }
  };
};