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
      spec.testModel(Session, true);
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
    spec.heading('INTEGRATION TEST', function () {
      spec.example('simulate logging in etc', spec.asyncResults(true), function (callback) {

        var self = this;
        var store = new MemoryStore();
        var session1 = new Session();
        var session2 = new Session();

        var user1 = new User(), name1 = 'jack', pass1 = 'wack', ip1 = '123';
        user1.set('name', name1);
        user1.set('password', pass1);
        user1.set('active', true);

        var user2 = new User(), name2 = 'jill', pass2 = 'pill', ip2 = '456';
        user2.set('name', name2);
        user2.set('password', pass2);
        user2.set('active', true);

        // start with empty store and add some users
        store.putModel(user1, userStored);
        store.putModel(user2, userStored);


        // callback after users stored
        function userStored(model, error) {
          if (typeof error != 'undefined') {
            callback(error);
            return;
          }
          if (user1.get('id') && user2.get('id')) {
            // users added to store now log them both in and also generate 2 errors
            self.goodCount = 0;
            self.badCount = 0;
            session1.startSession(store, name1, 'badpassword', ip1, usersStarted);
            session1.startSession(store, name1, pass1, ip1, usersStarted);
            session2.startSession(store, 'john', pass2, ip2, usersStarted);
            session2.startSession(store, name2, pass2, ip2, usersStarted);
          }
        }

        // callback after session started called
        function usersStarted(err, session) {
          if (err)
            self.badCount++;
          else
            self.goodCount++;

          if (self.badCount == 2 && self.goodCount == 2) {
            // Resume session1 correctly
            new Session().resumeSession(store, ip1, session1.get('passCode'), sessionResumed_Test1);
          }
        }
        function sessionResumed_Test1(err, session) {
          if (err)
            callback(Error('sessionResumed_Test1 failed'));
          else
          // Resume session2 with wrong passcode
            new Session().resumeSession(store, ip2, 'no more secrets', sessionResumed_Test2);
        }
        function sessionResumed_Test2(err, session) {
          if (err)
          // Resume session2 correctly now after failing
            new Session().resumeSession(store, ip2, session2.get('passCode'), sessionResumed_Test3);
          else
            callback(Error('sessionResumed_Test2 failed'));
        }
        function sessionResumed_Test3(err, session) {
          if (err)
            callback(Error('sessionResumed_Test3 failed:  ' + err));
          else
          // Now we end this session
            session.endSession(store, function (err, session) {
              if (err)
                callback(Error('session.endSession failed: '+err));
              else
              // Now try restoring again and it should fail
                new Session().resumeSession(store, ip2, session2.get('passCode'), sessionResumed_Test4);
            });
        }
        function sessionResumed_Test4(err, session) {
          if (err)
            callback(Error('sessionResumed_Test4 failed'));
          else
            callback(true);
        }
      });

    });
    // spec.runnerSessionIntegration();
  });
});
