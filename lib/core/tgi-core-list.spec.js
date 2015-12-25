/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-list.test.js
 */
spec.test('tgi-core/lib/tgi-core-list.spec.js', 'List', 'of items', function (callback) {
  var SurrogateListClass = List;
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
    spec.heading('findItemByID(id)', function () {
      spec.example('findItemByID returns false if not found', true, function () {
        var list = new List(new Model());
        return list.findItemByID(1) === false;
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
  spec.heading('List Integration', function () {
    spec.heading('List methods are tested here', function () {
      spec.example('list movement and sorting', undefined, function () {
        var test = this;
        // Create actor class
        var Actor = function (args) {
          Model.call(this, args);
          this.modelType = "Actor";
          this.attributes.push(new Attribute('name'));
          this.attributes.push(new Attribute('born', 'Number'));
          this.attributes.push(new Attribute('isMale', 'Boolean'));
        };
        Actor.prototype = inheritPrototype(Model.prototype);

        // Create list of actors
        var actor = new Actor();
        var actors = new List(actor);
        var actorsInfo = [
          // Actor              Born  Male
          ['Jack Nicholson', 1937, true],
          ['Meryl Streep', 1949, false],
          ['Marlon Brando', 1924, true],
          ['Cate Blanchett', 1969, false],
          ['Robert De Niro', 1943, true],
          ['Judi Dench', 1934, false],
          ['Al Pacino', 1940, true],
          ['Nicole Kidman', 1967, false],
          ['Daniel Day-Lewis', 1957, true],
          ['Shirley MacLaine', 1934, false],
          ['Dustin Hoffman', 1937, true],
          ['Jodie Foster', 1962, false],
          ['Tom Hanks', 1956, true],
          ['Kate Winslet', 1975, false],
          ['Anthony Hopkins', 1937, true],
          ['Angelina Jolie', 1975, false],
          ['Paul Newman', 1925, true],
          ['Sandra Bullock', 1964, false],
          ['Denzel Washington', 1954, true],
          ['Renée Zellweger', 1969, false]
        ];

        // Build List
        for (var i in actorsInfo) {
          if (actorsInfo.hasOwnProperty(i)) {
            if (actorsInfo[i][2]) { // for some populate model then add to list
              actor.set('name', actorsInfo[i][0]);
              actor.set('born', actorsInfo[i][1]);
              actor.set('isMale', actorsInfo[i][2]);
              actors.addItem(actor);
            } else {
              actors.addItem(); // add blank then set attribs
              actors.set('name', actorsInfo[i][0]);
              actors.set('born', actorsInfo[i][1]);
              actors.set('isMale', actorsInfo[i][2]);
            }
            actors.set('id', i);
          }
        }

        // Test movement thru list
        actors.moveFirst();
        test.shouldBeTrue(actors.get('name') == 'Jack Nicholson');
        actors.moveNext();
        test.shouldBeTrue(actors.get('name') == 'Meryl Streep');
        actors.moveLast();
        test.shouldBeTrue(actors.get('name') == 'Renée Zellweger');

        // Sort the list
        actors.sort({born: -1});  // Youngest actor
        actors.moveFirst();
        test.shouldBeTrue(actors.get('name') == 'Kate Winslet' || actor.get('name') == 'Angelina Jolie');
        actors.sort({born: 1});  // Oldest actor
        actors.moveFirst();
        test.shouldBeTrue(actors.get('name') == 'Marlon Brando');

        // find by id 6 Al Pacino
        test.shouldBeTrue(actors.findItemByID(6));
        test.shouldBeTrue(actors.get('name') == 'Al Pacino');

      });
      spec.runnerListStoreIntegration(MemoryStore);
    });
  });
});
spec.runnerListStoreIntegration = function (SurrogateStore) {
  spec.example('Test variations on getList method.', spec.asyncResults(true), function (callback) {
    var test = this;
    var storeBeingTested = new SurrogateStore();
    test.log('storeBeingTested: ' + storeBeingTested);

    // Create list of actors
    test.actorsInfo = [
      // Actor Born Male Oscards
      ['Jack Nicholson', new Date("01/01/1937"), true, 3],
      ['Meryl Streep', new Date("01/01/1949"), false, 3],
      ['Marlon Brando', new Date("01/01/1924"), true, 2],
      ['Cate Blanchett', new Date("01/01/1969"), false, 1],
      ['Robert De Niro', new Date("01/01/1943"), true, 2],
      ['Judi Dench', new Date("01/01/1934"), false, 1],
      ['Al Pacino', new Date("01/01/1940"), true, 1],
      ['Nicole Kidman', new Date("01/01/1967"), false, null],
      ['Daniel Day-Lewis', new Date("01/01/1957"), true, null],
      ['Shirley MacLaine', new Date("01/01/1934"), false, null],
      ['Dustin Hoffman', new Date("01/01/1937"), true, null],
      ['Jodie Foster', new Date("01/01/1962"), false, null],
      ['Tom Hanks', new Date("01/01/1956"), true, null],
      ['Kate Winslet', new Date("01/01/1975"), false, null],
      ['Anthony Hopkins', new Date("01/01/1937"), true, null],
      ['Angelina Jolie', new Date("01/01/1975"), false, null],
      ['Paul Newman', new Date("01/01/1925"), true, null],
      ['Sandra Bullock', new Date("01/01/1964"), false, null],
      ['Denzel Washington', new Date("01/01/1954"), true, null],
      ['Renée Zellweger', new Date("01/01/1969"), false, null]
    ];

    // Create actor class
    test.Actor = function (args) {
      Model.call(this, args);
      this.modelType = "Actor";
      this.attributes.push(new Attribute('name'));
      this.attributes.push(new Attribute('born', 'Date'));
      this.attributes.push(new Attribute('isMale', 'Boolean'));
      this.attributes.push(new Attribute('oscarWs', 'Number'));
    };
    test.Actor.prototype = inheritPrototype(Model.prototype);
    test.actor = new test.Actor(); // instance to use for stuff

    // Make sure store starts in known state.  Stores such as mongoStore will retain test values.
    // So... use getList to get all Actors then delete them from the Store
    test.list = new List(new test.Actor());
    test.oldActorsKilled = 0;
    test.oldActorsFound = 0;
    try {
      test.killhim = new test.Actor();
      storeBeingTested.getList(test.list, [], function (list, error) {
        if (typeof error != 'undefined') {
          callback(error);
          return;
        }
        if (list._items.length < 1)
          storeActors();
        else {
          test.oldActorsFound = list._items.length;
          var testakill = function (model, error) {
            if (++test.oldActorsKilled >= test.oldActorsFound) {
              storeActors();
            }
          };
          for (var i = 0; i < list._items.length; i++) {
            test.killhim.set('id', list._items[i][0]);
            storeBeingTested.deleteModel(test.killhim, testakill);
          }
        }
      });
    }
    catch (err) {
      callback(err);
    }

    // callback after model cleaned
    // now, build List and add to store
    function storeActors() {
      test.actorsStored = 0;
      for (var i = 0; i < test.actorsInfo.length; i++) {
        test.actor.set('ID', null);
        test.actor.set('name', test.actorsInfo[i][0]);
        test.actor.set('born', test.actorsInfo[i][1]);
        test.actor.set('isMale', test.actorsInfo[i][2]);
        storeBeingTested.putModel(test.actor, actorStored);
      }
    }

    // callback after actor stored
    function actorStored(model, error) {
      if (typeof error != 'undefined') {
        callback(error);
        return;
      }
      if (++test.actorsStored >= test.actorsInfo.length) {
        getAllActors();
      }
    }

    // test getting all 20
    function getAllActors() {
      try {
        storeBeingTested.getList(test.list, {}, function (list, error) {
          if (typeof error != 'undefined') {
            callback(error);
            return;
          }
          test.shouldBeTrue(list._items.length == 20, '20');
          getTomHanks();
        });
      }
      catch (err) {
        callback(err);
      }
    }

    // only one Tom Hanks
    function getTomHanks() {
      try {
        storeBeingTested.getList(test.list, {name: "Tom Hanks"}, function (list, error) {
          if (typeof error != 'undefined') {
            callback(error);
            return;
          }
          test.shouldBeTrue(list._items.length == 1, ('1 not ' + list._items.length));
          getD();
        });
      }
      catch (err) {
        callback(err);
      }
    }

    // 3 names begin with D
    // test RegExp
    function getD() {
      try {
        storeBeingTested.getList(test.list, {name: /^D/}, function (list, error) {
          if (typeof error != 'undefined') {
            callback(error);
            return;
          }
          test.shouldBeTrue(list._items.length == 3, ('3 not ' + list._items.length));
          getRZ();
        });
      }
      catch (err) {
        callback(err);
      }
    }

    // Renée Zellweger only female starting name with 'R'
    // test filter 2 properties (logical AND)
    function getRZ() {
      try {
        storeBeingTested.getList(test.list, {name: /^r/i, isMale: false}, function (list, error) {
          if (typeof error != 'undefined') {
            callback(error);
            return;
          }
          test.shouldBeTrue(list._items.length == 1, ('1 not ' + list._items.length));
          if (list._items.length)
            test.shouldBeTrue(list.get('name') == 'Renée Zellweger', 'rz');
          getAlphabetical();
        });
      }
      catch (err) {
        callback(err);
      }
    }

    // Retrieve list alphabetically by name
    // test order parameter
    function getAlphabetical() {
      try {
        storeBeingTested.getList(test.list, {}, {name: 1}, function (list, error) {
          if (typeof error != 'undefined') {
            callback(error);
            return;
          }
          // Verify each move returns true when move succeeds
          test.shouldBeTrue(list.moveFirst(), 'moveFirst');
          test.shouldBeTrue(!list.movePrevious(), 'movePrevious');
          test.shouldBeTrue(list.get('name') == 'Al Pacino', 'AP');
          test.shouldBeTrue(list.moveLast(), 'moveLast');
          test.shouldBeTrue(!list.moveNext(), 'moveNext');
          test.shouldBeTrue(list.get('name') == 'Tom Hanks', 'TH');
          callback(true);
        });
      }
      catch (err) {
        callback(err);
      }
    }
  });
};