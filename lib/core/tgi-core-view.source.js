/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core-view.source.js
 */
/**
 * Constructor
 */
function View(primaryModel, relatedModels, attributes) {
  if (false === (this instanceof View)) throw new Error('new operator required');
  if (!(primaryModel instanceof Model)) throw new Error('argument must be a Model');
  if (typeof relatedModels != 'object') throw new Error('object expected');
  if (!(attributes instanceof Array)) throw new Error('array of attributes expected');
  this.primaryModel = primaryModel;
  this.relatedModels = relatedModels;
  this.attributes = attributes;
  /**
   * Make sure relatedModels valid
   */
  for (var relatedModel in relatedModels) {
    if (relatedModels.hasOwnProperty(relatedModel)) {
      var obj = relatedModels[relatedModel];
      //console.log('relatedModel ' + relatedModel);
      //console.log('obj ' + JSON.stringify(obj));
      if (typeof obj != 'object') throw new Error('relatedModel key values expect object');
      if (obj.id === undefined) throw new Error('relatedModel key values expect object with id key');
      if (obj.model === undefined) throw new Error('relatedModel key values expect object with model key');
      if (!(obj.id instanceof Attribute)) throw new Error('relatedModel id must be a Attribute');
      if (!(obj.model instanceof Model)) throw new Error('relatedModel model must be a Model');
    }
  }
  /**
   * Check attributes
   */
  for (var i = 0; i < attributes.length; i++) {
    var attribute = attributes[i];
    if (!(attribute instanceof Attribute)) throw new Error('attribute array must contain Attributes');
    if (!(attribute.model instanceof Attribute)) throw new Error('attribute array must contain Attributes with model references');
  }
}
/**
 * Methods
 */
View.prototype.toString = function () {
  return this.primaryModel + ' View';
};
