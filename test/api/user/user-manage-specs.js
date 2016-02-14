'use strict';

process.env.NODE_ENV = 'test';

var request = require('../../helper/setup-supertest')('http://localhost:3001')
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
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.not.have.property('email');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should not allow access to other users', (done) => {
      login('test2@test.com', 'test')
        .then(() => {
          return request
            .get('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
          res.body.value.should.not.have.property('email');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow access to owner users', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .get('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.email.should.be.equal('test@test.com');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow access to admin users', (done) => {
      login('admin@test.com', 'test')
        .then(() => {
          return request
            .get('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.email.should.be.equal('test@test.com');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });
  });

  describe('#updateUser', () => {

    it('should not allow access to anonymous users', (done) => {
      request
        .put('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
        .send({
          nickname: 'should not update'
        })
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.not.have.property('nickname');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should not allow access to other users', (done) => {
      login('test2@test.com', 'test')
        .then(() => {
          return request
            .put('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
            .send({
              nickname: 'should not update'
            })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
          res.body.value.should.not.have.property('nickname');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow access to owner users', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .put('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
            .send({
              nickname: "should update"
            })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.nickname.should.be.equal('should update');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should not allow access to admin users', (done) => {
      login('admin@test.com', 'test')
        .then(() => {
          return request
            .put('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
            .send({
              nickname: 'should not update'
            })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
          res.body.value.should.not.have.property('nickname');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should expire login session after changing password', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .put('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
            .send({
              password: 'test2'
            })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.nickname.should.be.equal('should update');
        })
        .then(() => {
          return request
            .get('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.not.have.property('email');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow login with new password', (done) => {
      login('test@test.com', 'test2')
        .then(() => {
          return request
            .get('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.email.should.be.equal('test@test.com');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });
  });

  describe('#removeUser', () => {
    var testId = '11bc6f7b9b0d0b0457673daf';
    var test2Id = '21bc6f7b900d0aa457673daf';

    it('should not allow access to anonymous users', (done) => {
      request
        .delete('/api/v1/users/' + testId)
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should not allow to destory other users', (done) => {
      login('test2@test.com', 'test')
        .then(() => {
          return request
            .delete('/api/v1/users/' + testId)
            .expect(500)
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
          res.body.value.should.have.property('message');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow admin users to remove user', (done) => {
      login('admin@test.com', 'test')
        .then(() => {
          return request
            .delete('/api/v1/users/' + test2Id)
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.should.have.property('value', null);
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should not allow admin users to remove non-existing user', (done) => {
      login('admin@test.com', 'test')
        .then(() => {
          return request
            .delete('/api/v1/users/' + test2Id)
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserNotFound.code);
          res.body.value.should.have.property('message');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });
  });
  
});