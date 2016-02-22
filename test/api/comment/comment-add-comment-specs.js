'use strict';

process.env.NODE_ENV = 'test';

var request = require('../../helper/setup-supertest')('http://localhost:3001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , login = require('../../helper/login')(request)
  , logout = require('../../helper/logout')(request)
  , mongoInit = require('../../init/mongo-init')
  , commentInit = require('../../init/comments-init')
  , PostModel = require('../../../lib/model/post')
  , postInit = require('../../init/posts-init')
  , mongoose = require('mongoose')
  ;

describe('Add Comment API', () => {

  before((done) => {
    mongoInit.connect().then(commentInit).catch(console.log).fin(done);
  });

  after((done) => {
    commentInit().then(mongoInit.disconnect).catch(console.log).fin(done);
  });

  describe('#addComment', () => {
    var pid = '35bc6f7b9b0d0b0457673daf';

    it('should not allow anonymous users to post new comment', (done) => {
      request
        .post('/api/v1/comments/')
        .send({
          text: 'malicious text',
          pid: pid
        })
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should not be an empty comment', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/comments/')
            .send({
              text: '',
              pid: pid
            })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.EmptyComment.code);
          res.body.value.should.have.property('message');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow logged-in users to post new comment', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/comments/')
            .send({
              text: 'yay im logged in',
              pid: pid
            })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.exist;
          var cid = res.body.value;

          return request
            .get('/api/v1/posts/' + pid)
            .toPromise();
        })
        .then((res) => {
          res.body.value.should.have.property('comments');
          res.body.value.comments.should.have.length.above(0);
          res.body.value.comments[0].should.have.property('text', 'yay im logged in');
        })
        .then(postInit)
        .then(commentInit) 
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should be added in right post', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/comments/')
            .send({
              text: 'This is comment',
              pid: pid
            })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.exist;
          var cid = res.body.value;
          console.log("cid is " + cid);

          return request
            .get('/api/v1/posts/' + pid)
            .toPromise();
        })
        .then((res) => {
          res.body.value.should.have.property('comments');
          res.body.value.comments.should.have.length.above(0);
          res.body.value.comments[0].should.have.property('text', 'This is comment');
        })
        .then(postInit)
        .then(commentInit)
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });
  });

});
