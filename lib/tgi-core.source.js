/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core.js
 **/
var CORE = function () {
  return {
    version: '0.0.7',
    injectMethods: function (that) {
      //that.inheritPrototype = inheritPrototype;
      that.Attribute = Attribute;
    }
  };
};