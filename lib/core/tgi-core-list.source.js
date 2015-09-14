/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-list.source.js
 */
// Constructor
var List = function (model) {
  if (false === (this instanceof List)) throw new Error('new operator required');
  if (false === (model instanceof Model)) throw new Error('argument required: model');
  this.model = model; // todo make unit test for this
  this._items = [];
  this._itemIndex = -1;
};
List.prototype.length = function () {
  return this._items.length;
};
List.prototype.clear = function () {
  this._items = [];
  this._itemIndex = -1;
  return this;
};
List.prototype.get = function (attribute) {
  if (this._items.length < 1) throw new Error('list is empty');
  for (var i = 0; i < this.model.attributes.length; i++) {
    if (this.model.attributes[i].name.toUpperCase() == attribute.toUpperCase())
      return this._items[this._itemIndex][i];
  }
};
List.prototype.set = function (attribute, value) {
  if (this._items.length < 1) throw new Error('list is empty');
  for (var i = 0; i < this.model.attributes.length; i++) {
    if (this.model.attributes[i].name.toUpperCase() == attribute.toUpperCase()) {
      this._items[this._itemIndex][i] = value;
      return;
    }
  }
  throw new Error('attribute not valid for list model');
};
List.prototype.addItem = function (item) {
  var i;
  var values = [];
  if (item) {
    for (i in item.attributes) {
      values.push(item.attributes[i].value);
    }
  } else {
    for (i in this.model.attributes) {
      values.push(undefined);
    }
  }
  this._items.push(values);
  this._itemIndex = this._items.length - 1;
  return this;
};
List.prototype.removeItem = function () {
  this._items.splice(this._itemIndex, 1);
  this._itemIndex--;
  return this;
};
List.prototype.findItemByID = function (id) {
  var gotMore = this.moveFirst();
  while (gotMore) {
    if (id == this._items[this._itemIndex][0])
      return true;
    gotMore = this.moveNext();
  }
  return false;
};
List.prototype.indexedItem = function (index) {
  if (this._items.length < 1) return false;
  if (index < 0) return false;
  if (index >= this._items.length) return false;
  this._itemIndex = index;
  return true;
};
List.prototype.moveNext = function () {
  if (this._items.length < 1) return false;
  return this.indexedItem(this._itemIndex + 1);
};
List.prototype.movePrevious = function () {
  if (this._items.length < 1) return false;
  return this.indexedItem(this._itemIndex - 1);
};
List.prototype.moveFirst = function () {
  if (this._items.length < 1) return false;
  return this.indexedItem(0);
};
List.prototype.moveLast = function () {
  if (this._items.length < 1) return false;
  return this.indexedItem(this._items.length - 1);
};
List.prototype.sort = function (key) {
  var i = 0;
  var keyvalue;
  for (var keyName in key) {
    if (!keyvalue) keyvalue = keyName;
  }
  if (!keyvalue) throw new Error('sort order required');
  var ascendingSort = (key[keyvalue] == 1);
  while (i < this.model.attributes.length && this.model.attributes[i].name != keyvalue) i++;
  this._items.sort(function (a, b) {
    if (ascendingSort) {
      if (a[i] < b[i])
        return -1;
      if (a[i] > b[i])
        return 1;
    } else {
      if (a[i] > b[i])
        return -1;
      if (a[i] < b[i])
        return 1;
    }
    return 0;
  });
};
