'use strict';

process.env.NODE_ENV = 'test';

var request = require('../../helper/setup-supertest')('http://localhost:3001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , login = require('../../helper/login')(request)
  , logout = require('../../helper/logout')(request)
  , mongoInit = require('../../init/mongo-init')
  , postsInit = require('../../init/posts-init')
  ;

describe('Delete post API', () => {

  before((done) => {
    mongoInit.connect().then(postsInit).catch(console.log).fin(done);
  });

  after((done) => {
    postsInit().then(mongoInit.disconnect).catch(console.log).fin(done);
  });

  describe('#deletePost', () => {
    var pid = "35bc6f7b9b0d0b0457673daf";

    it('should not allow anonymous users to delete post', (done) => {
      request
        .delete('/api/v1/posts/' + pid)
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should not allow non-owners to delete the post', (done) => {
      login('test2@test.com', 'test')
        .then(() => {
          return request
            .delete('/api/v1/posts/' + pid)
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow the owner to delete the post', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .delete('/api/v1/posts/' + pid)
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
        })
        .then(postsInit)
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow the admin to delete the post', (done) => {
      login('admin@test.com', 'test')
        .then(() => {
          return request
            .delete('/api/v1/posts/' + pid)
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
        })
        .then(postsInit)
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should not allow the non-student and non-admin to delete the post', (done) => {
      var newPid = '38bc6f7b9b0d0b0457673daf'
      login('test@test.com', 'test')
        .then(() => {
          return request
            .delete('/api/v1/posts/' + newPid)
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

    it('should delete post from get list after delete', (done) => {
      let univId = '56ac6f7b9b0d0b0457673daf';
      request
        login('test@test.com', 'test')
        .then(() => {
          return request
            .delete('/api/v1/posts/' + pid)
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
        })
        .then(() => {
          return request
            .get('/api/v1/universities/' + univId + '/posts')
            .send({ age: 365 })
            .toPromise();
        })
        .then((res) => {
          console.log(JSON.stringify(res));
          res.body.status.should.be.equal(0);
          res.body.value.should.have.length(4);
          // posts descend from latest post to oldest
          res.body.value[3].should.not.have.property('title', 'Test Post2');
        })
        .then(done)
        .catch(done)
        .done();
    });

  });

});