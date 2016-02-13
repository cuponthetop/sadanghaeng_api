'use strict';

process.env.NODE_ENV = 'test';

var request = require('supertest-session')('http://localhost:3001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , login = require('../../helper/login')(request)
  , logout = require('../../helper/logout')(request)
  , mongoInit = require('../../init/mongo-init')
  , userInit = require('../../init/users-init')
  ;


describe('User API Report', () => {

  before((done) => {
    mongoInit.connect().then(userInit).catch(console.log).fin(done);
  });

  after((done) => {
    userInit().then(mongoInit.disconnect).catch(console.log).fin(done);
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
            logout().then(done);
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
            logout().then(done);
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
                logout().then(done);
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
            logout().then(done);
          });
      });
    });

    it('should not allow user to report same user twice', (done) => {
      login('test2@test.com', 'test').then(() => {
        request
          .post('/api/v1/users/' + testId + '/report')
          .expect(500)
          .end((err, res) => {
            res.body.status.should.be.equal(status.codes.AlreadyReported.code);
            res.body.value.should.have.property('message');
            logout().then(done);
          });
      });
    });
  });
});

