/**---------------------------------------------------------------------------------------------------------------------
 * /tgi-core/lib/models/tgi-core-model-session.test.js
 */
spec.test('/tgi-core/lib/models/tgi-core-model-session.spec.js', 'Session', 'for user host access', function (callback) {
  spec.heading('Session Model', function () {
    spec.paragraph('The Session Model represents the Session logged into the system. The library uses this for system' +
      ' access, logging and other functions.');
    spec.heading('CONSTRUCTOR', function () {
      spec.example('objects created should be an instance of Session', true, function () {
        return new Session() instanceof Session;
      });
      spec.heading('Model tests are applied', function () {
        spec.testModel(Session, true);
      });
    });
    spec.heading('ATTRIBUTES', function () {
      spec.example('following attributes are defined:', undefined, function () {
        var session = new Session(); // default attributes and values
        this.shouldBeTrue(session.get('id') === null);
        this.shouldBeTrue(session.get('userID') instanceof Attribute.ModelID);
        this.shouldBeTrue(session.get('userID').modelType == 'User');
        this.shouldBeTrue(session.get('dateStarted') instanceof Date);
        this.shouldBeTrue(session.get('passCode') === null);
        this.shouldBeTrue(session.get('ipAddress') === null);
        this.shouldBeTrue(session.get('active') === false);
      });
    });
    spec.heading('METHODS', function () {
      spec.heading('startSession()', function () {
        spec.paragraph('This method will create a new session record for a user.');
        spec.example('parameters are store, user, password, IP and callback', undefined, function () {
          this.shouldThrowError(Error('store required'), function () {
            new Session().startSession();
          });
          this.shouldThrowError(Error('userName required'), function () {
            new Session().startSession(new Store());
          });
          this.shouldThrowError(Error('password required'), function () {
            new Session().startSession(new Store(), 'blow');
          });
          this.shouldThrowError(Error('ip required'), function () {
            new Session().startSession(new Store(), 'blow', 'me');
          });
          this.shouldThrowError(Error('callback required'), function () {
            new Session().startSession(new Store(), 'blow', 'me', 'ipman');
          });
        });
      });
      spec.heading('resumeSession()', function () {
        spec.paragraph('This method will resume an existing session.');
        spec.example('parameters are store, IP, passcode and callback', undefined, function () {
          this.shouldThrowError(Error('store required'), function () {
            new Session().resumeSession();
          });
          this.shouldThrowError(Error('ip required'), function () {
            new Session().resumeSession(new Store());
          });
          this.shouldThrowError(Error('passCode required'), function () {
            new Session().resumeSession(new Store(), 'ipman');
          });
          this.shouldThrowError(Error('callback required'), function () {
            new Session().resumeSession(new Store(), 'ipman', '123');
          });
        });
      });
      spec.heading('endSession()', function () {
        spec.paragraph('Method to end session.');
        spec.example('parameters are store and callback - session object should be in memory', undefined, function () {
          this.shouldThrowError(Error('store required'), function () {
            new Session().endSession();
          });
          this.shouldThrowError(Error('callback required'), function () {
            new Session().endSession(new Store());
          });
        });
      });
    });
    // spec.runnerSessionIntegration();
  });
});
