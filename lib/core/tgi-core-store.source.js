/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core-store.source.js
 */

/**
 * Constructor
 */
var Store = function (args) {
  if (false === (this instanceof Store)) throw new Error('new operator required');
  args = args || {};
  this.storeType = args.storeType || "Store";
  this.name = args.name || 'a ' + this.storeType;
  this.storeProperty = {
    isReady: false,
    canGetModel: false,
    canPutModel: false,
    canDeleteModel: false,
    canGetList: false
  };
  var unusedProperties = getInvalidProperties(args, ['name', 'storeType']);
  var errorList = [];
  for (var i = 0; i < unusedProperties.length; i++) errorList.push('invalid property: ' + unusedProperties[i]);
  if (errorList.length > 1) throw new Error('error creating Store: multiple errors');
  if (errorList.length) throw new Error('error creating Store: ' + errorList[0]);
};
/**
 * Methods
 */
Store.prototype.toString = function () {
  if (this.name == 'a ' + this.storeType) {
    return this.name;
  } else {
    return this.storeType + ': ' + this.name;
  }
};
Store.prototype.getServices = function () {
  return this.storeProperty;
};
Store.prototype.onConnect = function (location, callback) {
  if (typeof location != 'string') throw new Error('argument must a url string');
  if (typeof callback != 'function') throw new Error('argument must a callback');
  callback(this, undefined);
};
Store.prototype.getModel = function () {
  throw new Error(this.storeType + ' does not provide getModel');
};
Store.prototype.putModel = function () {
  throw new Error('Store does not provide putModel');
};
Store.prototype.deleteModel = function () {
  throw new Error('Store does not provide deleteModel');
};
Store.prototype.getList = function () {
  throw new Error('Store does not provide getList');
};
Store.prototype.getViewList = function (viewList, filter, arg3, arg4) {
  var callback, order, i;
  if (typeof(arg4) == 'function') {
    callback = arg4;
    order = arg3;
  } else {
    callback = arg3;
  }
  if (!(viewList instanceof List)) throw new Error('argument must be a List');
  if (!viewList.view) throw new Error('List is Model type use getList');
  if (!(filter instanceof Object)) throw new Error('filter argument must be Object');
  if (typeof callback != "function") throw new Error('callback required');

  /**
   * use getList to populate initial rows
   */
  console.log('*** use getList to populate initial rows ***');
  var proxyList = new List(viewList.model);
  if (order)
    this.getList(proxyList, filter, order, gotProxyList);
  else
    this.getList(proxyList, filter, gotProxyList);

  /**
   * Process proxy list and populate list
   */
  function gotProxyList(list, error) {
    /**
     * clear target list and make sure no errors
     */
    viewList.clear();
    if (typeof error != 'undefined') {
      callback(viewList, error);
      return;
    }
    /**
     * Move through each row
     */
    var moreRows = proxyList.moveFirst();
/*    while (moreRows) {
      viewList.addItem();
      // Populate from primary row
      for (i = 0; i < viewList.attributes.length; i++) {
        var col = viewList.attributes[i];
        if (col.model == viewList.model) {
          viewList.set(col.name, proxyList.get(col.name));
        }
      }
      moreRows = proxyList.moveNext();
    }
    callback(viewList);*/

    /**
     * Process each row in proxy list fetch any related models
     */
    processRow();

    /**
     * Process Row
     */
    function processRow() {
      callback(viewList); // wip
    }

    /**
     * Process Column
     */
    function processColumn() {
    }
  }
};