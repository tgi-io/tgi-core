/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core-delta.spec.js
 */
spec.test('tgi-core/lib/tgi-core-delta.spec.js', 'Delta', '<insert description>', function (callback) {
  spec.heading('Delta Class', function () {
    spec.paragraph('Deltas represent changes to models.  They can be applied to a store then update the model.  ' +
    'They can be stored in logs as a change audit for the model.');
    spec.heading('CONSTRUCTOR', function () {
      spec.example('objects created should be an instance of Delta', true, function () {
        return new Delta(new Attribute.ModelID(new Model())) instanceof Delta;
      });
      spec.example('should make sure new operator used', Error('new operator required'), function () {
        Delta(); // jshint ignore:line
      });
      spec.example('Attribute.ModelID required in constructor', Error('Attribute.ModelID required in constructor'), function () {
        new Delta();
      });
    });
    spec.heading('PROPERTIES', function () {
      spec.heading('dateCreated', function () {
        spec.example('set to current date/time on creation', true, function () {
          var delta = new Delta(new Attribute.ModelID(new Model()));
          this.log(delta.dateCreated);
          return delta.dateCreated instanceof Date;
        });
      });
      spec.heading('modelID', function () {
        spec.example('set from constructor', "ModelID(Model:null)", function () {
          var delta = new Delta(new Attribute.ModelID(new Model()));
          this.log(delta.dateCreated);
          return delta.modelID.toString();
        });
      });
      spec.heading('attributeValues', function () {
        spec.example('created as empty object', 'object', function () {
          // attributeValues - {attribute:[before,after]}  before and after attribute values represent the model
          // attribute value changes. If the model attribute is type Table then attributeValues is array of
          // attributeValues corresponding to model -> attribute -> group....
          return typeof new Delta(new Attribute.ModelID(new Model())).attributeValues;
        });
      });
    });
  });
 
});
