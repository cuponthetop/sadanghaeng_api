'use strict';

process.env.NODE_ENV = 'test';

var request = require('supertest-session')('http://localhost:3001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , loginHelp = require('../../helper/login')
  , login = loginHelp.login.bind(undefined, request)
  , logout = loginHelp.logout.bind(undefined, request)
  , UserModel = require('../../../lib/model/user')
  , UserData = require('../../init/json/users.json')
  , mongoose = require('mongoose')
  , config = require('../../../config/config')
  ;


describe('User API Report', () => {

  before((done) => {
    // 몽고 db 연결
    var dbUri = config.db.uri + config.db.dbName;
    var dbOptions = {
      username: config.db.username,
      password: config.db.password
    };
    mongoose.connect(dbUri, dbOptions);

    UserModel.remove({}).exec().then(
      UserModel.create(UserData).then(() => {
        done();
      }, (err) => {
        console.log(err);
        done();
      }), (err) => {
        console.log(err);
        done();
      });
  });

  after((done) => {
    UserModel.remove({}).exec().then(
      UserModel.create(UserData).then(() => {
        mongoose.disconnect();
        done();
      }, (err) => {
        console.log(err);
        mongoose.disconnect();
        done();
      }), (err) => {
        console.log(err);
        mongoose.disconnect();
        done();
      });
  });

  describe('#reportUser', () => {
    var testId = '11bc6f7b9b0d0b0457673daf';

    it('should not allow anonymous users to report other user', (done) => {
      request
        .post('/api/v1/users/' + testId + '/report')
        .expect(500)
        .end((err, res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.have.property('message');
          done();
        });
    });

    it('should not allow user to report self', (done) => {
      login('test@test.com', 'test').then(() => {
        request
          .post('/api/v1/users/' + testId + '/report')
          .expect(500)
          .end((err, res) => {
            res.body.status.should.be.equal(status.codes.CantReportSelf.code);
            res.body.value.should.have.property('message');
            logout().then(() => {
              done();
            });
          });
      });
    });

    it('should not allow user to report not existing user', (done) => {
      var notexistingId = 'a1bc6f7b9b0d0b0457673daf';
      login('test@test.com', 'test').then(() => {
        request
          .post('/api/v1/users/' + notexistingId + '/report')
          .expect(500)
          .end((err, res) => {
            res.body.status.should.be.equal(status.codes.UserNotFound.code);
            res.body.value.should.have.property('message');
            logout().then(() => {
              done();
            });
          });
      });
    });

    it('should not allow user to report not verified user', (done) => {
      request
        .post('/api/v1/users/register')
        .send({
          email: 'test3@test.com',
          password: 'test3',
        })
        .expect(200)
        .end((err, res) => {
          var test3Id = res.body.value;
          res.body.status.should.be.equal(0);

          login('test@test.com', 'test').then(() => {
            request
              .post('/api/v1/users/' + test3Id + '/report')
              .expect(500)
              .end((err, res) => {
                res.body.status.should.be.equal(status.codes.UserNotVerified.code);
                res.body.value.should.have.property('message');
                logout().then(() => {
                  done();
                });
              });
          });
        });
    });

    it('should allow user to report other user', (done) => {
      login('test2@test.com', 'test').then(() => {
        request
          .post('/api/v1/users/' + testId + '/report')
          .expect(200)
          .end((err, res) => {
            res.body.status.should.be.equal(0);
            res.body.should.have.property('value', null);
            logout().then(() => {
              done();
            });
          });
      });
    });

    it('should not allow user to report same user twice', (done) => {
      login('test2@test.com', 'test').then(() => {
        request
          .post('/api/v1/users/' + testId + '/report')
          .expect(500)
          .end((err, res) => {
            res.body.status.should.be.equal(status.codes.UserAlreadyReported.code);
            res.body.value.should.have.property('message');
            logout().then(() => {
              done();
            });
          });
      });
    });
  });
});

