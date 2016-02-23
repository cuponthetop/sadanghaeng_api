'use strict';

process.env.NODE_ENV = 'test';

var request = require('../../helper/setup-supertest')('http://localhost:5001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , login = require('../../helper/login')(request)
  , logout = require('../../helper/logout')(request)
  , mongoInit = require('../../init/mongo-init')
  , postsInit = require('../../init/posts-init')
  ;

describe('Get Individual Post API', () => {

  before((done) => {
    mongoInit.connect().then(postsInit).catch(console.log).fin(done);
  });

  after((done) => {
    postsInit().then(mongoInit.disconnect).catch(console.log).fin(done);
  });

  describe('#getPost', () => {
    var pid = "35bc6f7b9b0d0b0457673daf";

    it('should not allow anonymous users to get a post', (done) => {
      request
        .get('/api/v1/posts/' + pid)
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should get the correct individual post', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .get('/api/v1/posts/' + pid)
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.title.should.be.equal('Test Post2');
          res.body.value.readCount.should.be.equal(2);
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should get the correct individual post non-owner should increase read count', (done) => {
      login('test2@test.com', 'test')
        .then(() => {
          return request
            .get('/api/v1/posts/' + pid)
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.title.should.be.equal('Test Post2');
          res.body.value.readCount.should.be.equal(3);
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should throw error if post not found', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .get('/api/v1/posts/' + '91231241')
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.PostNotFound.code);
          res.body.value.should.have.property('message');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

  });
});