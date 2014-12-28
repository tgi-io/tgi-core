/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-store.spec.js
 */
spec.test('tgi-core/lib/tgi-core-store.spec.js', 'Store', 'holds Model objects for updating and retrieving', function (callback) {
  spec.paragraph('The store class is used for object persistence.');
  spec.heading('CONSTRUCTOR', function () {
    spec.runnerStoreConstructor(Store);
  });
  spec.runnerStoreMethods(Store);
});

spec.runnerStoreConstructor = function (SurrogateStore) {
  spec.example('objects created should be an instance of Store', true, function () {
    return new SurrogateStore() instanceof Store;
  });
  spec.example('should make sure new operator used', Error('new operator required'), function () {
    SurrogateStore(); // jshint ignore:line
  });
  spec.example('should make sure properties are valid', Error('error creating Store: invalid property: food'), function () {
    new SurrogateStore({food: 'twinkies'});
  });
};
spec.runnerStoreMethods = function (SurrogateStore) {
  spec.heading('PROPERTIES', function () {
    spec.heading('name', function () {
      spec.example('name of store can be set in constructor', 'punchedCards', function () {
        return new SurrogateStore({name: 'punchedCards'}).name;
      });
    });
    spec.heading('storeType', function () {
      spec.paragraph('storeType defaults to Store Class Name but can be set to suite the app architecture.');
      spec.example('storeType can be set in constructor', 'legacyStorage', function () {
        return new SurrogateStore({storeType: 'legacyStorage'}).storeType;
      });
    });
  });
  spec.heading('METHODS', function () {
    var services = new SurrogateStore().getServices();
    spec.example('getServices() returns an object with interface for the Store.', undefined, function () {
      this.log(JSON.stringify(services));
      this.shouldBeTrue(services instanceof Object);
      this.shouldBeTrue(typeof services['isReady'] == 'boolean'); // don't use until
      this.shouldBeTrue(typeof services['canGetModel'] == 'boolean'); // define all allowed methods...
      this.shouldBeTrue(typeof services['canPutModel'] == 'boolean');
      this.shouldBeTrue(typeof services['canDeleteModel'] == 'boolean');
      this.shouldBeTrue(typeof services['canGetList'] == 'boolean');
    });
    spec.heading('toString()', function () {
      spec.example('should return a description of the Store', "ConvenienceStore: 7-Eleven", function () {
        var cStore = new SurrogateStore();
        this.log(cStore.toString());
        cStore.name = '7-Eleven';
        cStore.storeType = 'ConvenienceStore';
        this.log(cStore.toString());
        return cStore.toString();
      });
    });
    spec.heading('onConnect()', function () {
      spec.example('must pass url string', Error('argument must a url string'), function () {
        new SurrogateStore().onConnect();
      });
      spec.example('must pass callback function', Error('argument must a callback'), function () {
        new SurrogateStore().onConnect("");
      });
      if (services['isReady']) {
        spec.example('return store and undefined error upon successful connection to remote store.', spec.asyncResults(true), function (callback) {
          new SurrogateStore().onConnect('', function (store, err) {
            if (err) {
              callback(err);
            } else {
              callback(store instanceof Store);
            }
          });
        });
      } else {
        spec.paragraph('see integration test for ' + new SurrogateStore().storeType);
      }
    });
    spec.heading('getModel()', function () {
      if (services['canGetModel']) {
        spec.example('must pass valid model', Error('argument must be a Model'), function () {
          new SurrogateStore().getModel();
        });
        spec.example('model must have no validation errors', Error('model has validation errors'), function () {
          var m = new Model();
          m.attributes = null;
          new SurrogateStore().getModel(m);
        });
        spec.example('ID attribute must have truthy value', Error('ID not set'), function () {
          new SurrogateStore().getModel(new Model());
        });
        spec.example('callback function required', Error('callBack required'), function () {
          var m = new Model();
          m.attributes[0].value = 1;
          new SurrogateStore().getModel(m);
        });
        if (services['isReady']) {
          spec.example('returns error when model not found', spec.asyncResults('Error: model not found in store'), function (callback) {
            var m = new Model();
            m.attributes[0].value = 1;
            new SurrogateStore().getModel(m, function (mod, err) {
              if (err) {
                callback(err);
              } else {
                callback(mod);
              }
            });
          });
        } else {
          spec.paragraph('skipping tests since store is not ready');
        }
      } else {
        spec.example('getModel() is not implemented for virtual class', Error(new SurrogateStore().storeType + ' does not provide getModel'), function () {
          new SurrogateStore().getModel();
        });
      }
    });
    spec.heading('putModel(model)', function () {
      if (services['canPutModel']) {
        spec.example('must pass valid model', Error('argument must be a Model'), function () {
          new SurrogateStore().putModel();
        });
        spec.example('model must have no validation errors', Error('model has validation errors'), function () {
          var m = new Model();
          m.attributes = null;
          new SurrogateStore().putModel(m);
        });
        spec.example('callback function required', Error('callBack required'), function () {
          var m = new Model();
          m.attributes[0].value = 1;
          new SurrogateStore().putModel(m);
        });
        if (services['isReady']) {
          spec.example('returns error when model not found', spec.asyncResults('Error: model not found in store'), function (callback) {
            var m = new Model();
            m.attributes[0].value = 1;
            new SurrogateStore().putModel(m, function (mod, err) {
              if (err) {
                callback(err);
              } else {
                callback(mod);
              }
            });
          });
          spec.example('creates new model when ID is not set', spec.asyncResults(true), function (callback) {
            // This works but pollutes store with crap
            var m = new Model();
            new SurrogateStore().putModel(m, function (mod, err) {
              if (err) {
                callback(err);
              } else {
                callback(mod.get('id') ? true : false);
              }
            });
          });
        } else {
          spec.paragraph('skipping tests since store is not ready');
        }
      } else {
        spec.example('putModel() is not implemented for virtual class', Error('Store does not provide putModel'), function () {
          new SurrogateStore().putModel();
        });
      }
    });
    spec.heading('deleteModel(model)', function () {
      if (services['canDeleteModel']) {
        spec.example('must pass valid model', Error('argument must be a Model'), function () {
          new SurrogateStore().deleteModel();
        });
        spec.example('model must have no validation errors', Error('model has validation errors'), function () {
          var m = new Model();
          m.attributes = null;
          new SurrogateStore().deleteModel(m);
        });
        spec.example('callback function required', Error('callBack required'), function () {
          var m = new Model();
          m.attributes[0].value = 1;
          new SurrogateStore().deleteModel(m);
        });
        if (services['isReady']) {
          spec.example('returns error when model not found', spec.asyncResults('Error: model not found in store'), function (callback) {
            var m = new Model();
            m.modelType = 'PeopleAreString!';
            m.attributes[0].value = 90210;
            new SurrogateStore().deleteModel(m, function (mod, err) {
              if (err) {
                callback(err);
              } else {
                callback(mod);
              }
            });
          });
        } else {
          spec.paragraph('skipping tests since store is not ready');
        }
      } else {
        spec.example('deleteModel() is not implemented for virtual class', Error('Store does not provide deleteModel'), function () {
          new SurrogateStore().deleteModel();
        });
      }
    });
    spec.heading('getList(model, filter, order)', function () {
      spec.paragraph('This method will clear and populate the list with collection from store.  ' +
      'The **filter** property can be used to query the store.  ' +
      'The **order** property can specify the sort order of the list.  ' +
      '_See integration test for more info._');
      if (services['isReady'] && services['canGetList']) {
        spec.example('returns a List populated from store', undefined, function () {
          this.shouldThrowError(Error('argument must be a List'), function () {
            new SurrogateStore().getList();
          });
          this.shouldThrowError(Error('filter argument must be Object'), function () {
            new SurrogateStore().getList(new List(new Model()));
          });
          this.shouldThrowError(Error('callBack required'), function () {
            new SurrogateStore().getList(new List(new Model()), []);
          });
          // See integration tests for examples of usage
        });
      } else {
        if (services['isReady']) {
          spec.example('returns a List populated from store', Error('Store does not provide getList'), function () {
            return new SurrogateStore().getList();
          });
        }
      }
    });
  });
  spec.heading('Store Integration', function () {
    spec.heading('CRUD (Create Read Update Delete)', function () {
      spec.example('Exercise all store function for one store.', spec.asyncResults(true), function (callback) {
        var self = this;
        spec.integrationStore = new SurrogateStore();
        var storeBeingTested = spec.integrationStore.name + ' ' + spec.integrationStore.storeType;
        self.log(storeBeingTested);

        // If store is not ready then get out...
        if (!spec.integrationStore.getServices().isReady) {
          self.log('Store is not ready.');
          callback(true);
          return;
        }

        // setup stooge class
        self.Stooge = function (args) {
          Model.call(this, args);
          this.modelType = "_tempTest_Stooge";
          this.attributes.push(new Attribute('name'));
        };
        self.Stooge.prototype = inheritPrototype(Model.prototype);

        // create initial stooges
        self.moe = new self.Stooge();
        self.moe.set('name', 'Moe');
        self.larry = new self.Stooge();
        self.larry.set('name', 'Larry');
        self.shemp = new self.Stooge();
        self.shemp.set('name', 'Shemp');

        // IDs after stored will be here
        self.stoogeIDsStored = [];
        self.stoogesRetrieved = [];
        self.oldStoogesFound = 0;
        self.oldStoogesKilled = 0;

        // Make sure store starts in known state.  Stores such as mongoStore will retain test values.
        // So... use getList to get all stooges then delete them from the Store
        var useListToCleanStart = spec.integrationStore.getServices().canGetList;
        if (useListToCleanStart) {
          var list = new List(new self.Stooge());
          try {
            self.killhim = new self.Stooge();
            spec.integrationStore.getList(list, [], function (list, error) {
              if (typeof error != 'undefined') {
                callback(error);
                return;
              }
              if (list._items.length < 1)
                storeStooges();
              else
                self.oldStoogesFound = list._items.length;
              for (var i = 0; i < list._items.length; i++) {
                self.killhim.set('id', list._items[i][0]);
                /* jshint ignore:start */
                spec.integrationStore.deleteModel(self.killhim, function (model, error) {
                  if (++self.oldStoogesKilled >= self.oldStoogesFound) {
                    storeStooges();
                  }
                })
                /* jshint ignore:end */
              }
            });
          }
          catch (err) {
            callback(err);
          }
        } else {
          storeStooges();
        }

        // Callback to store new stooges
        function storeStooges() {
          self.log(self.oldStoogesFound);
          self.log(self.oldStoogesKilled);
          spec.integrationStore.putModel(self.moe, stoogeStored);
          spec.integrationStore.putModel(self.larry, stoogeStored);
          spec.integrationStore.putModel(self.shemp, stoogeStored);
        }

        // callback after storing stooges
        function stoogeStored(model, error) {
          if (typeof error != 'undefined') {
            callback(error);
            return;
          }
          try {
            self.stoogeIDsStored.push(model.get('id'));
            if (self.stoogeIDsStored.length == 3) {
              self.shouldBeTrue(true,'here');
              // Now that first 3 stooges are stored lets retrieve and verify
              var actors = [];
              for (var i = 0; i < 3; i++) {
                actors.push(new self.Stooge());
                actors[i].set('id', self.stoogeIDsStored[i]);
                spec.integrationStore.getModel(actors[i], stoogeRetrieved);
              }
            }
          }
          catch (err) {
            callback(err);
          }
        }

        // callback after retrieving stored stooges
        function stoogeRetrieved(model, error) {
          if (typeof error != 'undefined') {
            callback(error);
            return;
          }
          self.stoogesRetrieved.push(model);
          if (self.stoogesRetrieved.length == 3) {
            self.shouldBeTrue(true,'here');
            // Now we have stored and retrieved (via IDs into new objects).  So verify the stooges made it
            self.shouldBeTrue(self.stoogesRetrieved[0] !== self.moe && // Make sure not a reference but a copy
            self.stoogesRetrieved[0] !== self.larry && self.stoogesRetrieved[0] !== self.shemp,'copy');
            var s = []; // get list of names to see if all stooges made it
            for (var i = 0; i < 3; i++) s.push(self.stoogesRetrieved[i].get('name'));
            self.log(s);
            self.shouldBeTrue(contains(s, 'Moe') && contains(s, 'Larry') && contains(s, 'Shemp'));
            // Replace Shemp with Curly
            var didPutCurly = false;
            for (i = 0; i < 3; i++) {
              if (self.stoogesRetrieved[i].get('name') == 'Shemp') {
                didPutCurly = true;
                self.stoogesRetrieved[i].set('name', 'Curly');
                try {
                  spec.integrationStore.putModel(self.stoogesRetrieved[i], stoogeChanged);
                }
                catch (err) {
                  callback(err);
                }
              }
            }
            if (!didPutCurly) {
              callback(Error("Can't find Shemp!"));
            }
          }
        }

        // callback after storing changed stooge
        function stoogeChanged(model, error) {
          if (typeof error != 'undefined') {
            callback(error);
            return;
          }
          self.shouldBeTrue(model.get('name') == 'Curly','Curly');
          var curly = new self.Stooge();
          curly.set('id', model.get('id'));
          try {
            spec.integrationStore.getModel(curly, storeChangedShempToCurly);
          }
          catch (err) {
            callback(err);
          }
        }

        // callback after retrieving changed stooge
        function storeChangedShempToCurly(model, error) {
          if (typeof error != 'undefined') {
            callback(error);
            return;
          }
          self.shouldBeTrue(model.get('name') == 'Curly','Curly');
          // Now test delete
          self.deletedModelId = model.get('id'); // Remember this
          spec.integrationStore.deleteModel(model, stoogeDeleted);
        }

        // callback when Curly is deleted
        function stoogeDeleted(model, error) {
          if (typeof error != 'undefined') {
            callback(error);
            return;
          }
          // model parameter is what was deleted
          self.shouldBeTrue(undefined === model.get('id')); // ID removed
          self.shouldBeTrue(model.get('name') == 'Curly'); // the rest remains
          // Is it really dead?
          var curly = new self.Stooge();
          curly.set('id', self.deletedModelId);
          spec.integrationStore.getModel(curly, hesDeadJim);
        }

        // callback after lookup of dead stooge
        function hesDeadJim(model, error) {
          if (typeof error != 'undefined') {
            if ((error != 'Error: id not found in store') && (error != 'Error: model not found in store')) {
              callback(error);
              return;
            }
          } else {
            callback(Error('no error deleting stooge when expected'));
            return;
          }
          // Skip List test if subclass can't do
          if (!spec.integrationStore.getServices().canGetList) {
            callback(true);
          } else {
            // Now create a list from the stooge store
            var list = new List(new self.Stooge());
            try {
              spec.integrationStore.getList(list, {}, {name:1}, listReady);
            }
            catch (err) {
              callback(err);
            }
          }
        }

        // callback after list created from store
        function listReady(list, error) {
//          list.sort({name:1});
          if (typeof error != 'undefined') {
            callback(error);
            return;
          }
          self.shouldBeTrue(list instanceof List,'is list');
          self.shouldBeTrue(list.length() == 2,'is 2');
          list.moveFirst();
          self.shouldBeTrue(list.get('name') == 'Larry','larry');
          list.moveNext();
          self.shouldBeTrue(list.get('name') == 'Moe','moe');
          callback(true);
        }
      });
    });
  });

};