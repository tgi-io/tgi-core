/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-list.test.js
 */
spec.test('tgi-core/lib/tgi-core-list.spec.js', 'List', 'of items', function (callback) {
  var SurrogateListClass = List;
  spec.heading('List Class', function () {
    spec.paragraph('Lists are an ordered collection of items.  Each item is an array of values that correspond to the attributes for model used in constructor.');
    spec.heading('CONSTRUCTOR', function () {
      spec.paragraph('Creation of all Collections must adhere to following examples:');
      spec.example('objects created should be an instance of List', true, function () {
        return new SurrogateListClass(new Model()) instanceof List;
      });
      spec.example('should make sure new operator used', Error('new operator required'), function () {
        List(); // jshint ignore:line
      });
      spec.example('must be instantiated with model parameter.  The model attributes represent the list columns.', Error('argument required: model'), function () {
        new List();
      });
    });
    spec.heading('PROPERTIES', function () {
    });
    spec.heading('METHODS', function () {
      spec.heading('length()', function () {
        spec.example('length method returns the number of items in the list.', 0, function () {
          return new List(new Model()).length();
        });
      });
      spec.heading('clear()', function () {
        spec.example('clear the list.', 0, function () {
          return new List(new Model()).addItem(new Model()).clear().length();
        });
      });
      spec.heading('get(attributeName)', function () {
        spec.paragraph('Gets value of attribute for given item.');
        spec.example('throws error if no current item', Error('list is empty'), function () {
          new List(new Model()).get('id'); // see integration tests
        });
      });
      spec.heading('set(attributeName,value)', function () {
        spec.paragraph('Sets value of attribute for given item.');
        spec.example('throws error if no current item', Error('list is empty'), function () {
          new List(new Model()).set('id'); // see integration tests
        });
        spec.example('throws an error if the attribute does not exists', Error('attribute not valid for list model'), function () {
          var list = new List(new Model());
          list.addItem(new Model());
          list.set('whatever');
        });
      });
      spec.heading('addItem()', function () {
        spec.example('add item to list verify length is correct.', 1, function () {
          var list = new List(new Model());
          return list.addItem(new Model()).length(); // returns ref for method chaining
        });
      });
      spec.heading('removeItem()', function () {
        spec.example('add then item to list verify length is correct.', 0, function () {
          var list = new List(new Model());
          return list.addItem(new Model()).removeItem().length(); // returns ref for method chaining
        });
      });
      spec.heading('moveNext()', function () {
        spec.example('move to next item in list', false, function () {
          return new List(new Model()).moveNext(); // Returns true when move succeeds
        });
      });
      spec.heading('movePrevious()', function () {
        spec.example('move to the previous item in list', false, function () {
          return new List(new Model()).movePrevious(); // Returns true when move succeeds
        });
      });
      spec.heading('moveFirst()', function () {
        spec.example('move to the first item in list', false, function () {
          return new List(new Model()).moveFirst(); // Returns true when move succeeds
        });
      });
      spec.heading('moveLast()', function () {
        spec.example('move to the last item in list', false, function () {
          return new List(new Model()).moveLast(); // Returns true when move succeeds
        });
      });
      spec.heading('sort(key)', function () {
        spec.example('sort 1,2 in reverse order and return first element', Error('sort order required'), function () {
          new List(new Model()).sort(); // see integration tests
        });
      });
    });
    //spec.runnerListIntegration();
  });
});
