/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core-text.source.js
 */
/**
 * Constructor
 */
function Text(contents) {
  if (false === (this instanceof Text)) throw new Error('new operator required');
  this.contents = contents || '';
}
/**
 * Methods
 */
Text.prototype.toString = function () {
  return 'Text: \'' + (this.contents || '') + '\'';
};
