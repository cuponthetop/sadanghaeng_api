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


describe('User API Manage', () => {

  before((done) => {
    mongoInit.connect().then(userInit).catch(console.log).fin(done);
  });

  after((done) => {
    userInit().then(mongoInit.disconnect).catch(console.log).fin(done);
  });

  describe('#getUser', () => {
    it('should not allow access to anonymous users', (done) => {
      request
        .get('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
        .end((err, res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.not.have.property('email');
          done(err);
        });
    });

    it('should not allow access to other users', (done) => {
      login('test2@test.com', 'test').then(() => {
        request
          .get('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
          .end((err, res) => {
            res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
            res.body.value.should.not.have.property('email');
            logout().then(done);
          });
      });
    });

    it('should allow access to owner users', (done) => {
      login('test@test.com', 'test').then(() => {
        request
          .get('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
          .end((err, res) => {
            res.body.status.should.be.equal(0);
            res.body.value.email.should.be.equal('test@test.com');
            logout().then(done);
          });
      });
    });

    it('should allow access to admin users', (done) => {
      login('admin@test.com', 'test').then(() => {
        request
          .get('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
          .end((err, res) => {
            res.body.status.should.be.equal(0);
            res.body.value.email.should.be.equal('test@test.com');
            logout().then(done);
          });
      });
    });
  });

  describe('#updateUser', () => {

    it('should not allow access to anonymous users', (done) => {
      request
        .put('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
        .send({
          nickname: 'should not update'
        })
        .end((err, res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.not.have.property('nickname');
          done(err);
        });
    });

    it('should not allow access to other users', (done) => {
      login('test2@test.com', 'test').then(() => {
        request
          .put('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
          .send({
            nickname: 'should not update'
          })
          .end((err, res) => {
            res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
            res.body.value.should.not.have.property('nickname');
            logout().then(done);
          });
      });
    });

    it('should allow access to owner users', (done) => {
      login('test@test.com', 'test').then(() => {
        request
          .put('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
          .send({
            nickname: "should update"
          })
          .end((err, res) => {
            res.body.status.should.be.equal(0);
            res.body.value.nickname.should.be.equal('should update');
            logout().then(done);
          });
      });
    });

    it('should not allow access to admin users', (done) => {
      login('admin@test.com', 'test').then(() => {
        request
          .put('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
          .send({
            nickname: 'should not update'
          })
          .end((err, res) => {
            res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
            res.body.value.should.not.have.property('nickname');
            logout().then(done);
          });
      });
    });

    it('should expire login session after changing password', (done) => {
      login('test@test.com', 'test').then(() => {
        request
          .put('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
          .send({
            password: 'test2'
          })
          .end((err, res) => {
            res.body.status.should.be.equal(0);
            res.body.value.nickname.should.be.equal('should update');

            request
              .get('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
              .end((err, res) => {
                res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
                res.body.value.should.not.have.property('email');
                done(err);
              });
          });
      });
    });

    it('should allow login with new password', (done) => {
      login('test@test.com', 'test2').then(() => {
        request
          .get('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
          .end((err, res) => {
            res.body.status.should.be.equal(0);
            res.body.value.email.should.be.equal('test@test.com');
            logout().then(done);
          });
      });
    });
  });

  describe('#removeUser', () => {
    var testId = '11bc6f7b9b0d0b0457673daf';
    var test2Id = '21bc6f7b900d0aa457673daf';

    it('should not allow access to anonymous users', (done) => {
      request
        .delete('/api/v1/users/' + testId)
        .expect(500)
        .end((err, res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.have.property('message');
          done(err);
        });
    });

    it('should not allow to destory other users', (done) => {
      login('test2@test.com', 'test').then(() => {
        request
          .delete('/api/v1/users/' + testId)
          .expect(500)
          .end((err, res) => {
            res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
            res.body.value.should.have.property('message');
            logout().then(done);
          });
      });
    });

    it('should allow admin users to remove user', (done) => {
      login('admin@test.com', 'test').then(() => {
        request
          .delete('/api/v1/users/' + test2Id)
          .end((err, res) => {
            res.body.status.should.be.equal(0);
            res.body.should.have.property('value', null);
            logout().then(done);
          });
      });
    });

    it('should not allow admin users to remove non-existing user', (done) => {
      login('admin@test.com', 'test').then(() => {
        request
          .delete('/api/v1/users/' + test2Id)
          .end((err, res) => {
            res.body.status.should.be.equal(status.codes.UserNotFound.code);
            res.body.value.should.have.property('message');
            logout().then(done);
          });
      });
    });

  });

});