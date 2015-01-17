/**---------------------------------------------------------------------------------------------------------------------
 * lib/interfaces/tgi-core-interfaces-repl.spec.js
 */

spec.testSection('Interfaces');
spec.test('tgi-core/lib/interfaces/tgi-core-interfaces-repl.spec.js', 'REPLInterface', 'Read Evaluate Print Loop Interface', function (callback) {
  spec.heading('REPLInterface', function () {
    spec.paragraph('The REPLInterface is a Read Evaluate Print Loop Interface.');
    spec.heading('CONSTRUCTOR', function () {
      spec.runnerInterfaceConstructor(REPLInterface);
    });
    spec.runnerInterfaceMethods(REPLInterface);
    spec.heading('METHODS', function () {
      spec.paragraph('The REPLInterface defines adds the following methods.');
      spec.paragraph('evaluateInput(line)');
      spec.example('called when line of input available', 'function', function () {
        return typeof REPLInterface.prototype.evaluateInput;
      });
      spec.paragraph('captureOutput(callback)');
      spec.example('called when line of input available', 'function', function () {
        return typeof REPLInterface.prototype.captureOutput;
      });
    });

  });
});
