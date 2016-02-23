'use strict';

process.env.NODE_ENV = 'test';

var request = require('../../helper/setup-supertest')('http://localhost:5001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , login = require('../../helper/login')(request)
  , logout = require('../../helper/logout')(request)
  , mongoInit = require('../../init/mongo-init')
  , commentInit = require('../../init/comments-init')
  ;

describe('Vote Comment API', () => {


  before((done) => {
    mongoInit.connect().then(commentInit).catch(console.log).fin(done);
  });

  after((done) => {
    commentInit().then(mongoInit.disconnect).catch(console.log).fin(done);
  });

  describe('#voteComment', () => {
    var cid = '77ac6f7b9b0d0b0457673daf';
    var pid = '34bc6f7b9b0d0b0457673daf';

    it('should not allow anonymous users to vote', (done) => {
      request
        .post('/api/v1/comments/' + cid + '/votes')
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('vote should not be empty', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/comments/' + cid + '/votes')
            .send({ voteType: '' })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.WrongVote.code);
          res.body.value.should.have.property('message');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('vote should be only up- or down-vote', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/comments/' + cid + '/votes')
            .send({ voteType: 'lol' })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.WrongVote.code);
          res.body.value.should.have.property('message');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should get right post to vote on and allow logged-in users to vote', (done) => {
      login('test2@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/comments/' + cid + '/votes')
            .send({ voteType: 'up' })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.should.have.property('value', null);
          return request
            .get('/api/v1/posts/' + pid)
            .toPromise();
        })
        .then((res) => {
          res.body.value.comments.should.exist;
          res.body.value.comments[0].should.have.property('likeCount', 1);
        })
        .then(commentInit)
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should only allow user to vote once', (done) => {
      login('test2@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/comments/' + cid + '/votes')
            .send({ voteType: 'up' })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
          return request
            .post('/api/v1/comments/' + cid + '/votes')
            .send({ voteType: 'down' })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.AlreadyVoted.code);
          res.body.value.should.have.property('message');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });
  });

});