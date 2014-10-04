/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/test/tgi-test-loadTests.js
 **/
function loadTests(testTGI, TGI, callback) {
  var bootstrap = testTGI().bootstrapTests(TGI,callback);
  if (bootstrap.error) {
    callback({error: Error('bootstrap test failed: ' + bootstrap.error)});
    return;
  }
  callback({done: true});
}