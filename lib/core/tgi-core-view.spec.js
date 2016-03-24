/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core-view.spec.js
 */
spec.test('tgi-core/lib/core/tgi-core-view.spec.js', 'View', 'related models', function (callback) {
  spec.heading('View', function () {
    spec.paragraph('Does stuff');
    spec.heading('CONSTRUCTOR', function () {
      spec.example('objects created should be an instance of View', true, function () {
        return new View(new Model(), {}, []) instanceof View;
      });
      spec.example('should make sure new operator used', Error('new operator required'), function () {
        View(); // jshint ignore:line
      });
      spec.example('first parameter is primary model', Error('argument must be a Model'), function () {
        new View();
      });
      spec.example('second parameter is object with related models', Error('object expected'), function () {
        new View(new Model());
      });
      spec.example('third parameter is array of attributes making up view', Error('array of attributes expected'), function () {
        new View(new Model(), {});
      });
      spec.example('related models are named objects with id & model', undefined, function () {
        this.shouldThrowError('Error: relatedModel key values expect object', function () {
          new View(new Model(), {eat: 'me'}, []);
        });
        this.shouldThrowError('Error: relatedModel key values expect object with id key', function () {
          new View(new Model(), {eat: {}}, []);
        });
        this.shouldThrowError('Error: relatedModel key values expect object with model key', function () {
          new View(new Model(), {eat: {id: 1}}, []);
        });
        this.shouldThrowError('Error: relatedModel id must be a Attribute', function () {
          new View(new Model(), {eat: {id: 1, model: new Model()}}, []);
        });
        this.shouldThrowError('Error: relatedModel model must be a Model', function () {
          new View(new Model(), {eat: {id: new Attribute({name: 'eatID'}), model: 2}}, []);
        });
      });
      spec.example('attributes must be valid attribute', Error('attribute array must contain Attributes'), function () {
        new View(new Model(), {}, ['this is so wrong']);
      });
      spec.example('attributes must be valid attribute', Error('attribute array must contain Attributes with model references'), function () {
        new View(new Model(), {}, [new Attribute({name: 'x'})]);
      });
    });
    spec.heading('METHODS', function () {
      spec.heading('toString()', function () {
        spec.example('should return a description of the view', 'a Model View', function () {
          return new View(new Model(), {}, []).toString();
        });
      });
    });
  });
});
