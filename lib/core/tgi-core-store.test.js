/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-store.spec.js
 */
spec.test('tgi-core/lib/tgi-core-store.spec.js', 'Store', function (callback) {
  spec.heading('Store Class', function () {
    spec.paragraph('The store class is used for object persistence.');
    spec.heading('CONSTRUCTOR', function () {
      spec.runnerStoreConstructor(Store);
    });
    spec.runnerStoreMethods(Store);
  });
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
    var services = new SurrogateStore().getServices();  // TODO change to methods ASAP!!!
    spec.example('getServices() returns an object with interface for the Store.', undefined, function () {
      //spec.show(services);
      //this.shouldBeTrue(services instanceof Object);
      //this.shouldBeTrue(typeof services['isReady'] == 'boolean'); // don't use until
      //this.shouldBeTrue(typeof services['canGetModel'] == 'boolean'); // define all allowed methods...
      //this.shouldBeTrue(typeof services['canPutModel'] == 'boolean');
      //this.shouldBeTrue(typeof services['canDeleteModel'] == 'boolean');
      //this.shouldBeTrue(typeof services['canGetList'] == 'boolean');
    });
    spec.heading('toString()', function () {
      spec.example('should return a description of the Store', "ConvenienceStore: 7-Eleven", function () {
        var cStore = new SurrogateStore();
        //spec.show(cStore.toString());
        cStore.name = '7-Eleven';
        cStore.storeType = 'ConvenienceStore';
        //spec.show(cStore.toString());
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
          //spec.example('returns error when model not found', spec.asyncResults(Error('model not found in store')), function (callback) {
          //  var m = new Model();
          //  m.attributes[0].value = 1;
          //  new SurrogateStore().getModel(m, function (mod, err) {
          //    if (err) {
          //      callback(err);
          //    } else {
          //      callback(mod);
          //    }
          //  });
          //});
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
          //spec.example('returns error when model not found', spec.asyncResults(Error('model not found in store')), function (callback) {
          //  var m = new Model();
          //  m.attributes[0].value = 1;
          //  new SurrogateStore().putModel(m, function (mod, err) {
          //    if (err) {
          //      callback(err);
          //    } else {
          //      callback(mod);
          //    }
          //  });
          //});
          //spec.xexample('creates new model when ID is not set', spec.asyncResults(true), function (callback) {
          //  // This works but pollutes store with crap
          //  var m = new Model();
          //  new SurrogateStore().putModel(m, function (mod, err) {
          //    if (err) {
          //      callback(err);
          //    } else {
          //      callback(mod.get('id') ? true : false);
          //    }
          //  });
          //});
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
          //spec.example('returns error when model not found', spec.asyncResults(Error('model not found in store')), function (callback) {
          //  var m = new Model();
          //  m.modelType = 'PeopleAreString!';
          //  m.attributes[0].value = 90210;
          //  new SurrogateStore().deleteModel(m, function (mod, err) {
          //    if (err) {
          //      callback(err);
          //    } else {
          //      callback(mod);
          //    }
          //  });
          //});
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
        if (services['isReady'] && services['canGetList']) {
          spec.example('returns a List populated from store', Error('Store does not provide getList'), function () {
            return new SurrogateStore().getList();
          });
        } else {
          //spec.xexample('returns a List populated from store', Error('Store does not provide getList'), function () {
          //  return new SurrogateStore().getList();
          //});
        }
      }
    });
  });
  //spec.runnerStoreIntegration();
};